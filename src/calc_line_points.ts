export interface LineSegment {
    x1:number; 
    y1:number; 

    x2: number;
    y2: number;

    y_points: number[];
}

export function calc_line_points ( x1:number, y1:number, x2: number, y2: number) : LineSegment

{
    let result:LineSegment = {
        x1 : x1,
        y1 : y1,

        x2 : x2,
        y2 : y2,

        y_points : []
    };

    // y = a * x + b

    // 1st point: y1 = a * x1 + b   =>   b = y1 - a * x1
    // 2nd point: y2 = a * x2 + b   =>   y2 = a * x2 + y1 - a * x1   =>
    //                                   y2 - y1 = a ( x2 - x1 ) =>
    //                                   a = ( y2 - y1 ) / ( x2 - x1 )
    //

    let a : number = ( y2 - y1 ) / ( x2 - x1 );
    let b : number = y1 - a * x1;

    for (let x = x1; x<=x2; x++) {
        result.y_points.push(
            Math.floor( a * x + b )
        )
    }

    return result;
}