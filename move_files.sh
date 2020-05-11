#! /bin/bash

echo $1
echo $2

# rsync --remove-source-files -av --progress /mnt/disk5/tv/American\ Dad/ /mnt/disk3/tv/American\ Dad/

ls $1 | xargs -n1 -P4 -I% rsync --remove-source-files -av --progress % $2
