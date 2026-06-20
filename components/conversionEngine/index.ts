'use client';

export type InputFormat = 'pdf' | 'jpg' | 'png' | 'txt' | 'xlsx' | 'docx';
export type OutputFormat = 'pdf' | 'jpg' | 'txt' | 'xlsx' | 'docx';

export interface ConversionResult {
    blob: Blob;
    filename: string;
    mimeType: string;
}

// Map of valid conversions: input -> set of possible outputs
const CONVERSION_MAP: Record<InputFormat, OutputFormat[]> = {
    pdf: ['jpg', 'txt', 'xlsx', 'docx'],
    jpg: ['pdf', 'docx'],
    png: ['pdf', 'docx'],
    txt: ['pdf', 'docx', 'xlsx'],
    xlsx: ['pdf', 'txt'],
    docx: ['pdf', 'txt'],
};

const MIME_TYPES: Record<OutputFormat, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    txt: 'text/plain',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const FILE_EXTENSIONS: Record<OutputFormat, string> = {
    pdf: '.pdf',
    jpg: '.zip', // multiple pages zipped
    txt: '.txt',
    xlsx: '.xlsx',
    docx: '.docx',
};

export function detectFormat(file: File): InputFormat | null {
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'pdf': return 'pdf';
        case 'jpg':
        case 'jpeg': return 'jpg';
        case 'png': return 'png';
        case 'txt': return 'txt';
        case 'xlsx': return 'xlsx';
        case 'docx': return 'docx';
        default: return null;
    }
}

export function getAvailableOutputs(inputFormat: InputFormat): OutputFormat[] {
    return CONVERSION_MAP[inputFormat] || [];
}

export function getOutputMimeType(format: OutputFormat): string {
    return MIME_TYPES[format];
}

export function getOutputExtension(format: OutputFormat): string {
    return FILE_EXTENSIONS[format];
}

export async function convert(
    file: File,
    inputFormat: InputFormat,
    outputFormat: OutputFormat,
    onProgress?: (progress: number) => void
): Promise<ConversionResult> {
    const key = `${inputFormat}->${outputFormat}`;
    let blob: Blob;

    switch (key) {
        case 'pdf->txt': {
            const { pdfToTxt } = await import('./pdf/pdfToTxt');
            blob = await pdfToTxt(file, onProgress);
            break;
        }
        case 'pdf->jpg': {
            const { pdfToJpg } = await import('./pdf/pdfToJpg');
            blob = await pdfToJpg(file, onProgress);
            break;
        }
        case 'pdf->docx': {
            const { pdfToDocx } = await import('./pdf/pdfToDocx');
            blob = await pdfToDocx(file, onProgress);
            break;
        }
        case 'pdf->xlsx': {
            const { pdfToXlsx } = await import('./pdf/pdfToXlsx');
            blob = await pdfToXlsx(file, onProgress);
            break;
        }
        case 'jpg->pdf':
        case 'png->pdf': {
            const { imageToPdf } = await import('./image/imageToPdf');
            blob = await imageToPdf(file, onProgress);
            break;
        }
        case 'jpg->docx':
        case 'png->docx': {
            const { imageToDocx } = await import('./image/imageToDocx');
            blob = await imageToDocx(file, onProgress);
            break;
        }
        case 'txt->pdf': {
            const { txtToPdf } = await import('./txt/txtToPdf');
            blob = await txtToPdf(file, onProgress);
            break;
        }
        case 'txt->docx': {
            const { txtToDocx } = await import('./txt/txtToDocx');
            blob = await txtToDocx(file, onProgress);
            break;
        }
        case 'txt->xlsx': {
            const { txtToXlsx } = await import('./txt/txtToXlsx');
            blob = await txtToXlsx(file, onProgress);
            break;
        }
        case 'xlsx->pdf': {
            const { xlsxToPdf } = await import('./xlsx/xlsxToPdf');
            blob = await xlsxToPdf(file, onProgress);
            break;
        }
        case 'xlsx->txt': {
            const { xlsxToTxt } = await import('./xlsx/xlsxToTxt');
            blob = await xlsxToTxt(file, onProgress);
            break;
        }
        case 'docx->pdf': {
            const { docxToPdf } = await import('./docx/docxToPdf');
            blob = await docxToPdf(file, onProgress);
            break;
        }
        case 'docx->txt': {
            const { docxToTxt } = await import('./docx/docxToTxt');
            blob = await docxToTxt(file, onProgress);
            break;
        }
        default:
            throw new Error(`Unsupported conversion: ${key}`);
    }

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const extension = getOutputExtension(outputFormat);
    const mimeType = getOutputMimeType(outputFormat);

    return {
        blob,
        filename: `${baseName}${extension}`,
        mimeType,
    };
}
