//Thomas Russel Carrel
//September 2015
//
//colorful_triangles.js
//
//Code is based on a combination of a few WebGl examples from:
//      https://sites.google.com/site/webglbook/
//

///////////////////////////////////////////////////////////////////////////////
//
//  Shaders are those from 
//      http://rodger.global-linguist.com/webgl/ch02/ColoredPoints.js
//
///////////////////////////////////////////////////////////////////////////////

//Vertex Shader
var VX_SHADER = 
'attribute vec4 a_Position;\n\
void main() {\n\
    gl_Position = a_Position;\n\
    gl_PointSize = 5.0;\n\
}\n';

var FG_SHADER = 
'precision mediump float;\n\
uniform vec4 u_FragColor;\n\
void main() {\n\
    gl_FragColor = u_FragColor;\n\
}\n';

///////////////////////////////////////////////////////////////////////////////
// 
//   main()
//
///////////////////////////////////////////////////////////////////////////////
function main()
{
        var canvas = document.getElementById('webgl');

        var gl = getWebGLContext(canvas);
        if( !gl )
        {
                console.log('Failed to retrieve the WebGL rendering context.');
                return;
        }

        //Initialize Shaders
        if( !initShaders(gl, VX_SHADER, FG_SHADER))
        {
                console.log('Shader initialization failed.');
                return;
        }

        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0)
        {
                console.log("Retrieval of <a_Position>'s location failed.");
                return;
        }

        var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
        if (u_FragColor < 0)
        {
                console.log("Retrieval of <u_FragColor>'s location failed.");
                return;
        }

        canvas.onmousedown = function(ev)
        {
                click(ev, gl, canvas, a_Position, u_FragColor);
        };

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
}

///////////////////////////////////////////////////////////////////////////////
//
//   click()
//
//     With the exception of the noted section, the is also mostly the same as
//   that from http://rodger.global-linguist.com/webgl/ch02/ColoredPoints.js
//   
///////////////////////////////////////////////////////////////////////////////

var g_points = [];
var g_colors = [];
function click(ev, gl, canvas, a_Position, u_FragColor)
{
        var x = ev.clientX;
        var y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        g_points.push([x, y]);

        ///////////////////////////////////////////////////////
        //   This is my code.  It determines the color based on
        //  the coordinates of the click rather than just the
        //  quadrant.
        //
        //   Four lines, I'm not really proud of it, but it's
        //  a start, I guess.
        ///////////////////////////////////////////////////////
        x = (x + 1.0)/2; //Adjust coordinates to valid color value.
        y = (y + 1.0)/2;
        var ave = (x + y)/2; //Let g be the average of the other two colors.
        g_colors.push([x, y, ave]);

        //The following is again no longer my code.

        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;
        for(var i = 0; i < len; i++)
        {
                var xy = g_points[i];
                var rgb = g_colors[i];

                gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
                gl.uniform4f(u_FragColor, rgb[0], rgb[1], rgb[2], 1.0);

                gl.drawArrays(gl.POINTS, 0, 1);
        }
}
