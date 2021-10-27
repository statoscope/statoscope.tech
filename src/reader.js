import Event from '@wdxlab/events';

export default class Reader {
  constructor(file) {
    this.file = file;
    this.chunkSize = 1024 * 1024;
    this.totalBytes = file.size;
    this.fromBytes = 0;
    this.loadedBytes = 0;
    this.eventProgress = new Event();
  }

  getNextChunkSize() {
    return this.fromBytes + this.chunkSize > this.totalBytes
      ? this.totalBytes - this.fromBytes
      : this.chunkSize;
  }

  canRead() {
    return this.fromBytes < this.totalBytes;
  }

  readChunk(file, from, to) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const blob = file.slice(from, to);
      fileReader.readAsText(blob);
      fileReader.addEventListener('load', () => resolve(fileReader.result));
      fileReader.addEventListener('error', () =>
        reject(new Error('Error while reading'))
      );
    });
  }

  readNextChunk() {
    const currentChunkSize = this.getNextChunkSize();
    const readChunkPromise = this.readChunk(
      this.file,
      this.fromBytes,
      this.fromBytes + currentChunkSize
    ).then((data) => {
      this.loadedBytes += currentChunkSize;
      this.eventProgress.emit(this, {
        total: this.totalBytes,
        loaded: this.loadedBytes,
        chunkSize: currentChunkSize,
      });
      return data;
    });
    this.fromBytes += currentChunkSize;
    return readChunkPromise;
  }

  async read() {
    const chunks = [];

    while (this.canRead()) {
      chunks.push(await this.readNextChunk());
    }

    return chunks;
  }
}
