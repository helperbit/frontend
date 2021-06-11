#!/bin/bash
OLD="style=\"fill:#cf202e\""
NEWFLOOD="style=\"fill:#003476\""
NEWWILDFIRE="style=\"fill:#ffcc00\""

cd out
for f in *.svg
do
  echo $f
  if [ -f $f -a -r $f ]; then
   sed "s/$OLD/$NEWFLOOD/g" "$f" > "flood/$f"
   sed "s/$OLD/$NEWWILDFIRE/g" "$f" > "wildfire/$f"
  else
   echo "Error: Cannot read $f"
  fi
done
