var NSStorage = require('../lib/nsstorage');
var expect = require('chai').expect;

function createMockStorage(){
  return {
    s:{},
    length: 0,
    getItem: function(key){
      return (key in this.s) ? this.s[key] : null;
    },
    setItem: function(key, val){
      if(!(key in this.s)) this.length++;
      this.s[key] = ''+val;
    },
    removeItem: function(key){
      if(key in this.s) this.length++;
      delete this.s[key];
    },
    key: function(idx){
      return Object.keys(this.s)[idx] || null;
    },
    clear: function(){
      this.length = 0;
      var _this = this;
      Object.keys(this.s).forEach(function(key){
        _this.removeItem(key);
      });
    }
  };
}



describe('nsstorage', function(){
  describe('singleStorage', function(){
    var ns;

    beforeEach(function(){
      var mockStorage = createMockStorage();
      ns = NSStorage.createNamespace('foo', mockStorage);
    });

    it('setItem', function(){
      ns.setItem('key', 'val');
    });
    describe('getItem', function(){
      it('return item', function(){
        ns.setItem('key', 'val');
        expect(ns.getItem('key')).to.equal('val');
      });
      it('returns null for nonexisting keys', function(){
        expect(ns.getItem('key')).to.be.null;
      });
    });
    it('removeItem', function(){
      ns.setItem('key', 'val');
      expect(ns.getItem('key')).to.equal('val');
      ns.removeItem('key');
      expect(ns.getItem('key')).to.be.null;
    });
    describe('length', function(){
      it('increases when new keya are added', function(){
        expect(ns.length).to.equal(0);
        ns.setItem('key', 'val');
        expect(ns.length).to.equal(1);
      });
      it('decreases when keya are removed', function(){
        expect(ns.length).to.equal(0);
        ns.setItem('key', 'val');
        expect(ns.length).to.equal(1);
        ns.removeItem('key');
        expect(ns.length).to.equal(0);
      });
    });
    describe('key', function(){
      it('returns item', function(){
        ns.setItem('key', 'val');
        expect(ns.key(0)).to.equal('key');
      });
      it('return null when out of bounds', function(){
        ns.setItem('key', 'val');
        expect(ns.key(0)).to.equal('key');
        expect(ns.key(1)).to.be.null;
      });
    });
    describe('clear', function(){
      it('removes all items from storage', function(){
        ns.setItem('key1', 'val1');
        ns.setItem('key2', 'val2');
        ns.clear();
        expect(ns.getItem('key')).to.be.null;
        expect(ns.length).to.equal(0);
        expect(ns.key(0)).to.be.null;
      });
    });
  });
  describe('multiple storages are isolated', function(){
    var ns1, ns2;

    beforeEach(function(){
      var mockStorage = createMockStorage();
      ns1 = NSStorage.createNamespace('foo', mockStorage);
      ns2 = NSStorage.createNamespace('bar', mockStorage);
    });

    it('for setItem', function(){
      ns1.setItem('key', 'val1');
      ns2.setItem('key', 'val2');
      expect(ns1.getItem('key')).to.equal('val1');
      expect(ns2.getItem('key')).to.equal('val2');
      expect(ns1.length).to.equal(1);
      expect(ns2.length).to.equal(1);
      expect(ns1.key(0)).to.equal('key');
      expect(ns2.key(0)).to.equal('key');
    });

    it('for removeItem', function(){
      ns1.setItem('key', 'val1');
      ns2.setItem('key', 'val2');
      ns1.removeItem('key');
      expect(ns1.getItem('key')).to.be.null;
      expect(ns2.getItem('key')).to.equal('val2');
      expect(ns1.length).to.equal(0);
      expect(ns2.length).to.equal(1);
      expect(ns1.key(0)).to.be.null;
      expect(ns2.key(0)).to.equal('key');
    });

    it('for clear', function(){
      ns1.setItem('key', 'val1');
      ns2.setItem('key', 'val2');
      ns1.clear();
      expect(ns1.getItem('key')).to.be.null;
      expect(ns2.getItem('key')).to.equal('val2');
      expect(ns1.length).to.equal(0);
      expect(ns2.length).to.equal(1);
      expect(ns1.key(0)).to.be.null;
      expect(ns2.key(0)).to.equal('key');
    });
  });
});
