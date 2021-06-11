#inkscape --verb=FitCanvasToDrawing --verb=FileSave --verb=FileQuit out/*.svg


for filename in out/*.svg; do
    inkscape --verb=FitCanvasToDrawing --verb=FileSave --verb=FileClose --verb=FileQuit $filename
done
