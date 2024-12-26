import { PublicKey } from "@solana/web3.js";

function CollectionDeploymentImplementation() {
    this.collectionAddress = null;
    this.signature = null;
}

CollectionDeploymentImplementation.prototype.setCollectionAddress = function(addressValue) {
    this.collectionAddress = new PublicKey(addressValue);
};

CollectionDeploymentImplementation.prototype.setSignature = function(signatureData) {
    this.signature = new Uint8Array(signatureData);
};

export default CollectionDeploymentImplementation;
