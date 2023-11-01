const azure = require('azure-storage');
const blobService = azure.createBlobService();

// Use the extracted parts from the URL
const accountName = 'storagejoeri';
const sasToken = 'sp=r&st=2023-11-01T12:27:32Z&se=2023-11-01T20:27:32Z&spr=https&sv=2022-11-02&sr=c&sig=ndoa3k5uFv0yLUFOR17nkKFhj2zpJaKe3gzixg7z9yw%3D';

// Create the connection string
const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};SharedAccessSignature=${sasToken}`;

blobService.withFilter(new azure.SASFilter());
blobService._init({ storageAccount: '', storageAccessKey: '', host: accountName });

const containerName = 'dgjoeri';
const blobName = 'numericData.csv';
const dataToSave = 'yourData';

// Check if the blob exists, and if not, create it
blobService.doesBlobExist(containerName, blobName, (error, result) => {
  if (error) {
    console.error('Error checking if blob exists', error);
  } else {
    if (!result.exists) {
      // Blob doesn't exist, so create it
      blobService.createBlockBlobFromText(containerName, blobName, dataToSave, (createError, createResult) => {
        if (createError) {
          console.error('Error creating blob', createError);
        } else {
          console.log('Blob created successfully');
        }
      });
    } else {
      // Blob already exists, update it if needed
      blobService.createBlockBlobFromText(containerName, blobName, dataToSave, (updateError, updateResult) => {
        if (updateError) {
          console.error('Error updating blob', updateError);
        } else {
          console.log('Blob updated successfully');
        }
      });
    }
  }
});
