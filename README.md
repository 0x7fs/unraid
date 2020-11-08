# UnRAID Server Config Info (Public Repo)

## Helpful Commands

### tmux

Create named session:

```sh
tmux new -s NAME
```

Attach to named session:

```sh
tmux a -t NAME
```

Cheatsheet: https://tmuxcheatsheet.com

### Disk Defrag

```sh
# The -r means read-only, so for this step no changes are made
# use /dev/mdX, not /dev/sdXX
root@Tower:~# xfs_db -r /dev/md3

# "frag" shows overall fragmentation
xfs_db> frag
actual 2031, ideal 1419, fragmentation factor 30.13%

# "frag -d" shows directory fragmentation
xfs_db> frag -d
actual 29, ideal 29, fragmentation factor 0.00%

# "frag -f" shows file fragmentation
xfs_db> frag -f
actual 1317, ideal 705, fragmentation factor 46.47%

xfs_db> quit
```

Resource: https://forums.unraid.net/topic/44592-defrag-xfs-array-drives/

## Things to Install

1. UnRAID NVIDIA (Must be done first to get NVIDIA drivers working properly)
2. NerdPack (Perl/tmux/etc) https://raw.githubusercontent.com/dmacias72/unRAID-NerdPack/master/plugin/NerdPack.plg
3. Unassigned Devices
