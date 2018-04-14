import request from "request";
import rp from "request-promise";
import jpeg from 'jpeg-js';


import { EventEmitter } from "events";
import * as performance from'perf_hooks';

export class ImageDownloader extends EventEmitter {
    private interval_id : number = -1;

    constructor(
        private url:string = "http://94.155.195.91:1087/oneshotimage.jpg",
        private frequency:number = 500
    ) {
        super();
    }

    start() {
        this.interval_id = setInterval(
            this.downloadImage.bind(this),
            this.frequency
        )
    }

    setFrequency(new_frequency:number) {
        if (this.interval_id!=-1) {
            clearInterval(this.interval_id);
            this.interval_id = -1;
        }
        this.frequency = new_frequency;

        this.start();
    }

    /**
     * Download JPEG image from this.url and decode it.
     */
    private downloadImage() {
        let start = process.hrtime();
        rp(this.getRequirePromiseOptions())
            .then( (image:jpeg.RawImageData<Uint8Array>) => {
                this.emit(
                    "new_raw_image",
                    image,
                    process.hrtime(start)[1]
                );
            });
    }

    private getRequirePromiseOptions() : rp.OptionsWithUrl {
        return {
            url: this.url,
            encoding : null, // return *body* as Buffer
            transform: function (
                    body : Buffer, 
                    response : request.Response
            ) {
                let start = process.hrtime();
                let decoded_image = jpeg.decode( body, true );
                // console.log( "JPEG Decoding time", process.hrtime(start)[1]/1e6 )
                return decoded_image;
            }
        };
    }

    public test(){
        console.log(this.url, this.frequency);
    }
}