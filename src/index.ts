import rp from "request-promise";
import request from "request";
import jpeg from 'jpeg-js';
import fs from "fs";
import * as CLP from "./calc_line_points";

import { ImageDownloader } from "./image_downloader";




let image_downloader = new ImageDownloader;
// image_downloader.setFrequency(600);
image_downloader.start();

image_downloader.on("new_raw_image", 
    (image:jpeg.RawImageData<Uint8Array>, process_time_ns:number) => {
        console.log(
            `${new Date()}: Image(${image.width} x ${image.height}) downloaded in ${process_time_ns / 1e6} ms`
        );
    });


