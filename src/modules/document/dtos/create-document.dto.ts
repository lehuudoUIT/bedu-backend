export class CreateDocumentDto {
  documentType: string;
  code: string;
  title: string;
  content: string;
  attachFile: string;
  isPublic: boolean;
}
