# npm-package-stat
A command line tool to generate npm package statistics with csv format

## Installation

```bash
npm i -g npm-package-stat
```

## Usage

### basic

```bash
npm-package-stat <path/to/project1> <path/to/project2> ...
```

![alt text](image.png)

### with options

```bash
npm-package-stat -D /path/to/project # Only extract devDependencies
npm-package-stat -D -O /path/to/project # Only extract devDependencies and optionalDependencies
```

```
-S             Only include dependencies                
-D             Only include devDependencies             
-O             Only include optionalDependencies        
-P             Only include peerDependencies            
```

### filter with depth

```bash
npm-package-stat /path/to/project --max-depth=0 # Only extract dependencies with depth = 0
npm-package-stat /path/to/project --max-depth=1 # Only extract dependencies with depth <= 1

npm-package-stat /path/to/project --depth=1 # Only extract dependencies with depth >= 1

npm-package-stat /path/to/project --depth=1 --max-depth=2 # Only extract dependencies with depth between 1 and 2
```