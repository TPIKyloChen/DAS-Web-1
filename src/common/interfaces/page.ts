export interface Content extends Page
{
    content: any[];
}
export interface Page {
    page: number;
    pageSize: number;
    total: number;
}