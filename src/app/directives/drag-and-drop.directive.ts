import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
})
export class DragAndDropDirective {
  // public constructor() { }
  @Output() public dropFile: EventEmitter<FileList> = new EventEmitter();
  @HostListener('dragover', ['$event']) public onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(
    e: DragEvent
  ): void {
    e.preventDefault();
    e.stopPropagation();
  }
  @HostListener('drop', ['$event']) public onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const files: FileList | undefined = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this.dropFile.emit(files);
    }
  }
}
