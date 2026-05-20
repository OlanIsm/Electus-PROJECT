import { DocumentsService } from './documents.service';
interface ExtractJsonBody {
    buffer: string;
    filename: string;
    mimetype: string;
    size: number;
}
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    health(): {
        status: string;
        service: string;
    };
    extract(body: ExtractJsonBody): Promise<{
        filename: string;
        mimetype: string;
        size: number;
        text: string;
    }>;
    extractFile(file: Express.Multer.File): Promise<{
        filename: string;
        mimetype: string;
        size: number;
        text: string;
    }>;
}
export {};
