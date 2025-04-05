# Vinyl Record Generator in p5.js

This tool lets you convert `.wav` audio files into SVG schematics suitable for 3D printing or laser cutting a (mostly!) playable vinyl record.

The code is derived from [Amanda Ghassaei's original LaserCutRecord project](https://github.com/amandaghassaei/LaserCutRecord), but with some adjustments so that all code can run within modern p5.js.

You can run the tool yourself locally, or better yet access a hosted version here: https://barneymurray.github.io/vinyl-record-cutter/

The default parameters have been tested and *should* produce something resembling the original audio, but you may find you need to tweak them! 

If you want something more visually interesting that won't be playable, you can increase line width and amplitude for a neat visualisation of your track. 

![image](sample_output.svg).

## Quickstart guide

1. Upload a `.wav` file.
2. The tool analyzes the audio and generates a **spiral waveform**.
3. Adjustable parameters let you fine-tune the physical characteristics of the record.
4. Export the result as an **SVG file**, ready for 3D printing, CNC routing, or laser cutting.

## Adjustable Parameters

| Parameter       | Description |
|----------------|-------------|
| **Sampling Rate** | Number of samples per second extracted from the audio file. Affects waveform fidelity. |
| **RPM** | Rotations per minute |
| **Amplitude** | Controls the vertical scale of the waveform grooves. Higher values = deeper/wider grooves. |
| **Spacing** | Distance between each spiral rotation (track spacing). |
| **Min Distance** | Minimum allowed spacing between peaks. |
| **Inner Hole** | Diameter of the central hole (in inches). |
| **Inner Radius** | Start radius of the playable area (in inches). |
| **Outer Radius** | Outer limit of the playable area (in inches). |
| **Line Width** | Thickness of the waveform spiral line in the SVG. |
| **Diameter** | Total diameter of the record. |

You can adjust these settings using the inputs in the UI, then click **"Update Record"** to re-render the record.

## Exporting

Click **"Save file"** to download an `.svg` file containing the spiral waveform + alignment/cut lines.

## License

This code is available to modify and distribute under the [GNU General Public License](LICENSE.md)
