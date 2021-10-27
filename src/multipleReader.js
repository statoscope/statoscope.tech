import Event from '@wdxlab/events';
import Reader from './reader';

export default class MultipleReader {
  constructor(files) {
    this.readers = files.map((file) => {
      const reader = new Reader(file);
      reader.eventProgress.on((sender, { total, loaded, chunkSize }) => {
        this.loadedBytes += chunkSize;
        this.eventProgress.emit(this, {
          total: this.totalBytes,
          loaded: this.loadedBytes,
        });
      });
      return reader;
    });
    this.totalBytes = files.reduce((all, current) => all + current.size, 0);
    this.loadedBytes = 0;
    this.eventProgress = new Event();
  }

  read() {
    console.time('f');
    return Promise.all(
      this.readers.map((reader) =>
        reader
          .read()
          .then((content) => ({ name: reader.file.name, content }))
          .catch((e) => {
            e.file = reader.file.name;
            throw e;
          })
      )
    ).then((data) => {
      console.timeEnd('f');
      return data;
    });
  }
}
