import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FrameViewerComponent } from './frame-viewer/frame-viewer.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { OpenFileDirective } from './open-file.directive';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';
@NgModule({
    declarations:[OpenFileDirective, VideoViewerComponent, FrameViewerComponent, ImageViewerComponent],
    exports:[ OpenFileDirective ],
    imports: [SharedModule]
})
export class DirectiveModule {}
