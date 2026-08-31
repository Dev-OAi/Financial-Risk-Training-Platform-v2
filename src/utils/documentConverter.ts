import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import JSZip from 'jszip';

// Configure PDF.js worker
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF.js worker initialization notice:', e);
  }
}

export interface ConvertedDocumentResult {
  dataUrl: string;
  mimeType: string;
  format: 'PNG' | 'JPG' | 'WEBP' | 'PDF' | 'DOCX' | 'DOC' | 'CLIPBOARD' | 'IMAGE';
  fileName: string;
  width?: number;
  height?: number;
  originalSize: number;
  pageCount?: number;
  pageNumber?: number;
  sourceType: string;
}

/**
 * Get image dimensions from a Data URL
 */
export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 400 });
    };
    img.src = dataUrl;
  });
};

/**
 * Render first page of a PDF File/ArrayBuffer to a high-resolution PNG Data URL
 */
export const convertPdfToImage = async (file: File | ArrayBuffer, scale = 2.5): Promise<{ dataUrl: string; width: number; height: number; pageCount: number }> => {
  const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
  
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  } as any);

  const pdfDoc = await loadingTask.promise;
  const pageCount = pdfDoc.numPages;
  
  // Render Page 1 (where the check is typically located)
  const page = await pdfDoc.getPage(1);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Canvas 2D context unavailable');
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Fill with white background before rendering
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    canvas: canvas
  };

  await (page.render(renderContext as any)).promise;

  const dataUrl = canvas.toDataURL('image/png');
  return {
    dataUrl,
    width: viewport.width,
    height: viewport.height,
    pageCount
  };
};

/**
 * Extract embedded check image or render content from a Word Document (.docx / .doc)
 */
export const convertDocxToImage = async (file: File): Promise<{ dataUrl: string; width: number; height: number; extractedMedia: boolean }> => {
  const arrayBuffer = await file.arrayBuffer();

  // Method 1: Try extracting embedded check images directly from the DOCX ZIP package (word/media/*)
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const mediaFolder = zip.folder('word/media');
    
    if (mediaFolder) {
      const mediaFiles = Object.keys(mediaFolder.files).filter(filename => {
        const lower = filename.toLowerCase();
        return !mediaFolder.files[filename].dir && (
          lower.endsWith('.png') || 
          lower.endsWith('.jpeg') || 
          lower.endsWith('.jpg') || 
          lower.endsWith('.webp') ||
          lower.endsWith('.bmp') ||
          lower.endsWith('.gif')
        );
      });

      if (mediaFiles.length > 0) {
        // Pick the largest image or the first one (most checks inserted in docx are high-res images)
        let bestFile = mediaFiles[0];
        let maxBytes = 0;

        for (const filename of mediaFiles) {
          const zipObj = zip.file(filename);
          if (zipObj) {
            // @ts-ignore
            const size = zipObj._data?.uncompressedSize || 0;
            if (size > maxBytes) {
              maxBytes = size;
              bestFile = filename;
            }
          }
        }

        const imageZipObj = zip.file(bestFile);
        if (imageZipObj) {
          const imageBlob = await imageZipObj.async('blob');
          const ext = bestFile.split('.').pop()?.toLowerCase() || 'png';
          const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
          
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(new Blob([imageBlob], { type: mime }));
          });

          const dims = await getImageDimensions(dataUrl);
          return {
            dataUrl,
            width: dims.width,
            height: dims.height,
            extractedMedia: true
          };
        }
      }
    }
  } catch (err) {
    console.warn('Direct zip media extraction from DOCX yielded fallback:', err);
  }

  // Method 2: Use Mammoth to extract inline images or text
  try {
    const convertImageHandler = (mammoth.images as any).imgElement
      ? (mammoth.images as any).imgElement((element: any) => {
          return element.read('base64').then((imageBuffer: string) => {
            return {
              src: 'data:' + element.contentType + ';base64,' + imageBuffer
            };
          });
        })
      : (mammoth.images as any).dataUri;

    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      convertImageHandler ? { convertImage: convertImageHandler } : {}
    );

    // Check if an image tag exists in converted HTML
    const match = result.value.match(/<img[^>]+src="([^">]+)"/);
    if (match && match[1]) {
      const dataUrl = match[1];
      const dims = await getImageDimensions(dataUrl);
      return {
        dataUrl,
        width: dims.width,
        height: dims.height,
        extractedMedia: true
      };
    }

    // Method 3: Render text content of check to a styled check canvas template
    const textContent = result.value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D unavailable');

    // Draw check background
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw decorative border
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Guilloche watermark simulation
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 20);
      ctx.lineTo(i + 100, canvas.height - 20);
      ctx.stroke();
    }

    // Header
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 24px "Segoe UI", sans-serif';
    ctx.fillText('OFFICIAL COMMERCIAL CHECK SPECIMEN (FROM WORD DOC)', 50, 70);

    // Body text from Word Doc
    ctx.fillStyle = '#0F172A';
    ctx.font = '16px "Courier New", monospace';
    const words = textContent.slice(0, 600).split(' ');
    let line = '';
    let y = 130;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 1050 && n > 0) {
        ctx.fillText(line, 50, y);
        line = words[n] + ' ';
        y += 28;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 50, y);

    // Bottom MICR line representation
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText('⑆121000358⑆ 8840291773⑈ 1042', 150, 480);

    const dataUrl = canvas.toDataURL('image/png');
    return {
      dataUrl,
      width: 1200,
      height: 540,
      extractedMedia: false
    };
  } catch (err: any) {
    throw new Error(`Failed to parse Word document: ${err.message || err}`);
  }
};

/**
 * Helper to safely read a Blob to a valid Data URL with guaranteed image MIME header
 */
const readBlobAsDataUrl = (blob: Blob, mimeType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      let result = reader.result as string;
      if (result.startsWith('data:application/octet-stream;base64,') || result.startsWith('data:;base64,')) {
        result = result.replace(/^data:[^;]*;base64,/, `data:${mimeType};base64,`);
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error('FileReader error while reading blob.'));
    reader.readAsDataURL(blob);
  });
};

/**
 * Universal Ingestion: Convert ANY image, PDF, DOC, DOCX, or Blob into a verified check preview Data URL
 */
export const convertFileToUniversalCheckImage = async (
  file: File | Blob, 
  customFileName?: string,
  onProgress?: (status: string) => void
): Promise<ConvertedDocumentResult> => {
  const fileName = customFileName || (file instanceof File ? file.name : 'pasted_screenshot.png');
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type || '';
  const originalSize = file.size;

  onProgress?.(`Detecting format for ${fileName}...`);

  // 1. PDF Files
  if (mimeType === 'application/pdf' || ext === 'pdf') {
    onProgress?.('Rendering PDF Page 1 to High-Res Specimen Image...');
    try {
      const pdfResult = await convertPdfToImage(file as File);
      return {
        dataUrl: pdfResult.dataUrl,
        mimeType: 'image/png',
        format: 'PDF',
        fileName,
        width: pdfResult.width,
        height: pdfResult.height,
        originalSize,
        pageCount: pdfResult.pageCount,
        sourceType: `PDF Document (${pdfResult.pageCount} ${pdfResult.pageCount === 1 ? 'page' : 'pages'})`
      };
    } catch (pdfErr) {
      console.error('Client PDF render error:', pdfErr);
      throw new Error('Could not render PDF document. Please verify the file is a valid PDF check.');
    }
  }

  // 2. Word Documents (.docx, .doc)
  if (
    mimeType.includes('word') || 
    mimeType.includes('officedocument') || 
    ext === 'docx' || 
    ext === 'doc'
  ) {
    onProgress?.('Extracting Check Specimen from Word Document...');
    try {
      const docResult = await convertDocxToImage(file as File);
      return {
        dataUrl: docResult.dataUrl,
        mimeType: 'image/png',
        format: ext === 'doc' ? 'DOC' : 'DOCX',
        fileName,
        width: docResult.width,
        height: docResult.height,
        originalSize,
        sourceType: docResult.extractedMedia 
          ? `Word Document (Extracted Embedded Check Image)` 
          : `Word Document (Voucher Layout Rendered)`
      };
    } catch (docErr) {
      console.error('Word Document parsing error:', docErr);
      throw new Error('Could not extract check from Word document. Please ensure it contains a check specimen.');
    }
  }

  // 3. Standard & Advanced Image Formats (PNG, JPG, JPEG, WEBP, GIF, SVG, BMP, AVIF, TIFF, ICO, Lumina/Linux Screenshots)
  onProgress?.('Normalizing Image Specimen...');
  
  // Read array buffer for binary inspection
  const arrayBuffer = await file.arrayBuffer();
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('The selected image file is empty (0 bytes).');
  }

  // Detect real MIME type using magic bytes + filename extension
  const headerBytes = new Uint8Array(arrayBuffer.slice(0, 16));
  let detectedMime = 'image/png';
  let detectedFormat: 'PNG' | 'JPG' | 'WEBP' | 'IMAGE' = 'PNG';

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (headerBytes[0] === 0x89 && headerBytes[1] === 0x50 && headerBytes[2] === 0x4E && headerBytes[3] === 0x47) {
    detectedMime = 'image/png';
    detectedFormat = 'PNG';
  }
  // JPEG magic bytes: FF D8 FF
  else if (headerBytes[0] === 0xFF && headerBytes[1] === 0xD8 && headerBytes[2] === 0xFF) {
    detectedMime = 'image/jpeg';
    detectedFormat = 'JPG';
  }
  // GIF magic bytes: 47 49 46 38
  else if (headerBytes[0] === 0x47 && headerBytes[1] === 0x49 && headerBytes[2] === 0x46 && headerBytes[3] === 0x38) {
    detectedMime = 'image/gif';
    detectedFormat = 'IMAGE';
  }
  // WebP magic bytes: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
  else if (headerBytes[0] === 0x52 && headerBytes[1] === 0x49 && headerBytes[2] === 0x46 && headerBytes[3] === 0x46 &&
           headerBytes[8] === 0x57 && headerBytes[9] === 0x45 && headerBytes[10] === 0x42 && headerBytes[11] === 0x50) {
    detectedMime = 'image/webp';
    detectedFormat = 'WEBP';
  }
  // BMP magic bytes: 42 4D
  else if (headerBytes[0] === 0x42 && headerBytes[1] === 0x4D) {
    detectedMime = 'image/bmp';
    detectedFormat = 'IMAGE';
  }
  // Fallback to extension or file.type
  else if (mimeType && mimeType.startsWith('image/')) {
    detectedMime = mimeType;
    if (mimeType.includes('png')) detectedFormat = 'PNG';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) detectedFormat = 'JPG';
    else if (mimeType.includes('webp')) detectedFormat = 'WEBP';
  } else if (ext === 'jpg' || ext === 'jpeg') {
    detectedMime = 'image/jpeg';
    detectedFormat = 'JPG';
  } else if (ext === 'webp') {
    detectedMime = 'image/webp';
    detectedFormat = 'WEBP';
  } else if (ext === 'png') {
    detectedMime = 'image/png';
    detectedFormat = 'PNG';
  }

  // Create typed Blob and guaranteed Data URL
  const typedBlob = new Blob([arrayBuffer], { type: detectedMime });
  const directDataUrl = await readBlobAsDataUrl(typedBlob, detectedMime);

  try {
    const dims = await getImageDimensions(directDataUrl);
    const width = dims.width || 1200;
    const height = dims.height || 600;

    return {
      dataUrl: directDataUrl,
      mimeType: detectedMime,
      format: detectedFormat,
      fileName,
      width,
      height,
      originalSize,
      sourceType: `Image Specimen (${detectedFormat})`
    };
  } catch (canvasErr) {
    console.warn('Image dimensions decode notice:', canvasErr);
    return {
      dataUrl: directDataUrl,
      mimeType: detectedMime,
      format: detectedFormat,
      fileName,
      width: 1200,
      height: 600,
      originalSize,
      sourceType: `Image Specimen (${detectedFormat})`
    };
  }
};

/**
 * Read Image directly from System Clipboard (Snipping Tool, Mac Screenshot, PrintScreen, Copied Image)
 */
export const readImageFromClipboard = async (): Promise<ConvertedDocumentResult | null> => {
  if (!navigator.clipboard || !navigator.clipboard.read) {
    throw new Error('System clipboard API is not available or blocked in this browser context.');
  }

  try {
    const clipboardItems = await navigator.clipboard.read();
    
    for (const item of clipboardItems) {
      // Look for image types (image/png, image/jpeg, image/webp, etc.)
      const imageType = item.types.find(t => t.startsWith('image/'));
      if (imageType) {
        const blob = await item.getType(imageType);
        const timestamp = new Date().toLocaleTimeString().replace(/:/g, '-');
        const fileName = `clipboard_snippet_${timestamp}.png`;
        
        const result = await convertFileToUniversalCheckImage(blob, fileName);
        return {
          ...result,
          format: 'CLIPBOARD',
          sourceType: 'Clipboard Snippet / Screenshot'
        };
      }
    }
    
    return null;
  } catch (err: any) {
    console.error('Clipboard reading error:', err);
    throw err;
  }
};

/**
 * Handle Paste Event (Ctrl+V / Cmd+V) to extract image blob
 */
export const extractImageFromPasteEvent = async (e: React.ClipboardEvent | ClipboardEvent): Promise<ConvertedDocumentResult | null> => {
  const items = e.clipboardData?.items;
  if (!items) return null;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf('image') !== -1) {
      const blob = item.getAsFile();
      if (blob) {
        const timestamp = new Date().toLocaleTimeString().replace(/:/g, '-');
        const fileName = `pasted_check_${timestamp}.png`;
        const result = await convertFileToUniversalCheckImage(blob, fileName);
        return {
          ...result,
          format: 'CLIPBOARD',
          sourceType: 'Pasted Screenshot / Image'
        };
      }
    }
  }

  return null;
};
