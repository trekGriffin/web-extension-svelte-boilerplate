#if (Test-Path -Path  " extension.zip") { Remove-Item -Path "extension.zip" -Force} 
Compress-Archive -Path "./dist" -DestinationPath "./extension.zip" -Force