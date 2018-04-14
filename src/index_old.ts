
import rp from "request-promise";
import request from "request";
import jpeg from 'jpeg-js';
import fs from "fs";
import * as CLP from "./calc_line_points";


var options: rp.OptionsWithUrl = {
    url: 'http://94.155.195.91:1087/oneshotimage.jpg',
    encoding: null,
    transform: function (
        body: Buffer,
        response: request.Response
    ) {
        performance.mark('Image Received');
        performance.measure('Download Image', 'Requesting Image', 'Image Received')
        let entry: PerformanceEntry = performance.getEntriesByName("Download Image")[0];
        console.log("Download image in:", entry.duration);


        performance.mark('JPEG decoding start');
        let decoded_image = jpeg.decode(body, true);
        performance.mark('JPEG decoding end');
        performance.measure('JPEG decoding', 'JPEG decoding start', 'JPEG decoding end');
        entry = performance.getEntriesByName("JPEG decoding")[0];
        console.log("JPEG decoding in:", entry.duration);
        // console.log(response.headers);
        // console.log(body.length);
        return decoded_image;
    }
};

performance.mark('Requesting Image');
rp(options)
    .then(function (image: jpeg.RawImageData<Uint8Array>) {
        console.log(image.data.length, image.data.BYTES_PER_ELEMENT);
        performance.mark('Clipping image start');

        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < 338; y++) {
                image.data[y * image.width * 4 + x * 4 + 0] = 255;
                image.data[y * image.width * 4 + x * 4 + 1] = 255;
                image.data[y * image.width * 4 + x * 4 + 2] = 255;
                image.data[y * image.width * 4 + x * 4 + 3] = 0;
                // console.log(image.data[y*image.width*4 + x*4 + 3]);
            }
        }

        for (let x = 586; x < image.width; x++) {
            for (let y = 338; y < image.height; y++) {
                image.data[y * image.width * 4 + x * 4 + 0] = 255;
                image.data[y * image.width * 4 + x * 4 + 1] = 255;
                image.data[y * image.width * 4 + x * 4 + 2] = 255;
                image.data[y * image.width * 4 + x * 4 + 3] = 0;
                // console.log(image.data[y*image.width*4 + x*4 + 3]);
            }
        }

        let line = CLP.calc_line_points(
            0, 338,
            586, image.height
        )

        for (let x = line.x1; x < line.x2; x++) {
            let y = line.y_points[x - line.x1];
            for (let y = line.y_points[x - line.x1]; y > 337; y--) {
                image.data[y * image.width * 4 + x * 4 + 0] = 255;
                image.data[y * image.width * 4 + x * 4 + 1] = 255;
                image.data[y * image.width * 4 + x * 4 + 2] = 255;
                image.data[y * image.width * 4 + x * 4 + 3] = 0;
            }
        }

        line = CLP.calc_line_points(
            0, 400,
            423, image.height
        )

        for (let x = line.x1; x < line.x2; x++) {
            let y = line.y_points[x - line.x1];
            for (let y = line.y_points[x - line.x1]; y < image.height; y++) {
                image.data[y * image.width * 4 + x * 4 + 0] = 255;
                image.data[y * image.width * 4 + x * 4 + 1] = 255;
                image.data[y * image.width * 4 + x * 4 + 2] = 255;
                image.data[y * image.width * 4 + x * 4 + 3] = 0;
            }
        }

        performance.mark('Clipping image end');
        performance.measure('Clipping image', 'Clipping image start', 'Clipping image end');
        let entry = performance.getEntriesByName("Clipping image")[0];
        console.log("Clipping image in:", entry.duration);


        performance.mark('Encode image start');
        var jpegImageData = jpeg.encode(image, 85);
        performance.mark('Encode image end');
        performance.measure('Encode image', 'Encode image start', 'Encode image end');
        entry = performance.getEntriesByName("Encode image")[0];
        console.log("Encode image in:", entry.duration);


        performance.measure('Total', 'Requesting Image', 'Encode image end');
        entry = performance.getEntriesByName("Total")[0];
        console.log("Total processing in:", entry.duration);

        console.log(jpegImageData.data.length)
        fs.writeFileSync("./out.jpeg", jpegImageData.data);
    })
    .catch(function (err: Error) {
        // Crawling failed...
        console.log(err.message)
    });

/**
 * Anything above the line (0,338)->(430,635)
 * y = a*x + b => y = 0.6906976744186046 * x + 338
 * 
 * (0,338) => b=338
 * (430,635) => 635 = a*430 + 338; 297 = a*430; a = 297/430 = 0.6906976744186046
*/
function mask_image(image: jpeg.RawImageData<Uint8Array>) {

}


