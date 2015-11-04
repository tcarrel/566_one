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
                attribute float a_Size;\n\
                void main() {\n\
                        gl_Position = a_Position;\n\
                                gl_PointSize = a_Size;\n\
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

        var a_Size = gl.getAttribLocation(gl.program, 'a_Size');
        if (a_Size < 0)
        {
                console.log("Retrieval of <a_Size>'s location failed.");
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
                click(ev, gl, canvas, a_Position, a_Size, u_FragColor);
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
var g_sizes  = [];
var verts = 0;
var new_vert = false;
var color = [1.0, 1.0, 1.0]; //Alpha is hard coded.
var size  = 0.5;
var timer;

function click(ev, gl, canvas, a_Position, a_Size, u_FragColor)
{        
        if( !new_vert )
        {
                //Create a new vertex and give it coordinates from the mouse.
                var width2 = canvas.width/2;
                var height2 = canvas.height/2;

                var x = ev.clientX; var y = ev.clientY;
                var rect = ev.target.getBoundingClientRect();

                x = ((x - rect.left) - width2)/width2;
                y = (height2 - (y - rect.top))/height2;

                g_points.push([x, y]);
                color = [1.0, 1.0, 1.0];
                new_vert = true;
                verts++;

                g_colors.push([color[0], color[1], color[2], 1.0]);
                g_sizes.push(size);

                //Begin cycling through colors.
                timer = setInterval(
                                function(){update_color(
                                        gl,
                                        a_Position,
                                        a_Size,
                                        u_FragColor)},
                                2,
                                gl,
                                a_Position,
                                a_Size,
                                u_FragColor);

                return;
        }
        else
        {
                //Stop color cycling.
                clearInterval(timer);
                new_vert = false;

                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                for(var i = 0; i < verts; i++)
                {
                        var pos = g_points[i];
                        var rgb = g_colors[i];

                        gl.vertexAttrib3f(
                                        a_Position,
                                        pos[0],
                                        pos[1],
                                        0.0);
                        gl.vertexAttrib1f(
                                        a_Size,
                                        g_sizes[i]);

                        gl.uniform4f(
                                        u_FragColor, 
                                        rgb[0],
                                        rgb[1],
                                        rgb[2],
                                        0.5); //Alpha, opaque.

                        gl.drawArrays(gl.POINTS, 0, 1);
                }
                return;
        }
}

function update_color(gl, a_Position, a_Size, u_FragColor)
{
        var i = 0;
        color[i] -= 0.01;
        i++;
        while( color[i - 1] < 0 && i < 3 )
        {
                color[i - 1] = 1.0;
                color[i] -= 0.1;
                i++;
        }

        g_sizes[verts - 1] += 0.025;
        if( g_sizes[verts - 1] > 50 )
        {
                g_sizes[verts - 1] = 0.5;
        }

        g_colors[verts - 1] =
                [color[0], color[1], color[2], 1.0];                        

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(var i = 0; i < verts; i++)
        {

                pos = g_points[i];
                rgb = g_colors[i];

                gl.vertexAttrib3f(
                                a_Position,
                                pos[0],
                                pos[1],
                                0.0);
                gl.vertexAttrib1f(
                                a_Size,
                                g_sizes[i]);
                gl.uniform4f(
                                u_FragColor, 
                                rgb[0],
                                rgb[1],
                                rgb[2],
                                0.5); //Alpha, opaque.

                gl.drawArrays(gl.POINTS, 0, 1);
        }
}
