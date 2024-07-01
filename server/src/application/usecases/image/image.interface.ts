export interface IImageService {
    upLoadImageS3({ file }: { file: any }): Promise<any>;
}
