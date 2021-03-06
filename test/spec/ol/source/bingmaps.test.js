import BingMaps from '../../../../src/ol/source/BingMaps.js';
import _ol_tilecoord_ from '../../../../src/ol/tilecoord.js';
import Observable from '../../../../src/ol/Observable.js';


describe('ol.source.BingMaps', function() {

  describe('#tileUrlFunction()', function() {

    let source, tileGrid;

    beforeEach(function(done) {
      source = new BingMaps({
        imagerySet: 'AerialWithLabels',
        key: ''
      });

      const client = new XMLHttpRequest();
      client.open('GET', 'spec/ol/data/bing_aerialwithlabels.json', true);
      client.onload = function() {
        source.handleImageryMetadataResponse(JSON.parse(client.responseText));
      };
      client.send();

      const key = source.on('change', function() {
        if (source.getState() === 'ready') {
          Observable.unByKey(key);
          tileGrid = source.getTileGrid();
          done();
        }
      });
    });

    it('getImagerySet works correctly', function() {
      expect(source.getImagerySet()).to.equal('AerialWithLabels');
    });

    it('getApiKey works correctly', function() {
      expect(source.getApiKey()).to.equal('');
    });

    it('returns the expected URL', function() {

      const coordinate = [829330.2064098881, 5933916.615134273];
      const projection = source.getProjection();
      const regex = /\/tiles\/h(.*)\.jpeg/;
      let tileUrl;

      tileUrl = source.tileUrlFunction(
        tileGrid.getTileCoordForCoordAndZ(coordinate, 1), 1, projection);
      expect(tileUrl.match(regex)[1]).to.equal(_ol_tilecoord_.quadKey([1, 1, 0]));

      tileUrl = source.tileUrlFunction(
        tileGrid.getTileCoordForCoordAndZ(coordinate, 2), 1, projection);
      expect(tileUrl.match(regex)[1]).to.equal(_ol_tilecoord_.quadKey([2, 2, 1]));

      tileUrl = source.tileUrlFunction(
        tileGrid.getTileCoordForCoordAndZ(coordinate, 3), 1, projection);
      expect(tileUrl.match(regex)[1]).to.equal(_ol_tilecoord_.quadKey([3, 4, 2]));

      tileUrl = source.tileUrlFunction(
        tileGrid.getTileCoordForCoordAndZ(coordinate, 4), 1, projection);
      expect(tileUrl.match(regex)[1]).to.equal(_ol_tilecoord_.quadKey([4, 8, 5]));

      tileUrl = source.tileUrlFunction(
        tileGrid.getTileCoordForCoordAndZ(coordinate, 5), 1, projection);
      expect(tileUrl.match(regex)[1]).to.equal(_ol_tilecoord_.quadKey(
        [5, 16, 11]));

      tileUrl = source.tileUrlFunction(
        tileGrid.getTileCoordForCoordAndZ(coordinate, 6), 1, projection);
      expect(tileUrl.match(regex)[1]).to.equal(_ol_tilecoord_.quadKey(
        [6, 33, 22]));

    });


  });

});
