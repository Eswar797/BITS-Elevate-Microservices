# Get all .env files in the repository
$envFiles = Get-ChildItem -Path Microservices -Include .env -Recurse -File | ForEach-Object { $_.FullName }

# Remove each .env file from Git tracking (without deleting the actual file)
foreach ($file in $envFiles) {
    Write-Host "Removing $file from Git tracking..."
    git rm --cached "$file"
    
    # Create a corresponding .env.example file
    $exampleFile = $file + ".example"
    Write-Host "Creating example file at $exampleFile..."
    
    # Read the original .env file and create an example with placeholders
    $content = Get-Content $file
    $exampleContent = @()
    
    foreach ($line in $content) {
        if ($line -match '^\s*#' -or $line -match '^\s*$') {
            # Keep comments and empty lines as is
            $exampleContent += $line
        }
        elseif ($line -match '^\s*([^=]+)=(.+)$') {
            # Replace actual values with placeholders
            $key = $matches[1]
            $exampleContent += "$key=your_${key}_here"
        }
    }
    
    # Write the example content to the .env.example file
    $exampleContent | Out-File -FilePath $exampleFile
}

# Create a new commit
git add .
git commit -m "Remove sensitive data from .env files"

# Try pushing to GitHub
Write-Host "Attempting to push to GitHub..."
git push -u origin main 