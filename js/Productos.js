"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Productos = void 0;
var Productos = /** @class */ (function () {
    function Productos() {
        var _this = this;
        this.setId = function (newProducto) {
            if (_this.getProductos().length === 0) {
                newProducto.id = 1;
            }
            else {
                var max = Math.max.apply(Math, __spreadArrays(_this.getProductos().map(function (producto) { return producto.id; }), [0]));
                newProducto.id = max + 1;
            }
            return newProducto;
        };
        this.getProductos = function () { return _this.productos; };
        this.setProductos = function (newProducto) {
            var producto = _this.setId(newProducto);
            _this.getProductos().push(producto);
        };
        this.updateProducto = function (producto) {
            _this.getProductos().forEach(function (prod) {
                if (prod.id === producto.id) {
                    prod.title = producto.title;
                    prod.price = producto.price;
                    prod.thumbnail = producto.thumbnail;
                }
            });
        };
        this.deleteProducto = function (id) { return _this.productos = _this.getProductos().filter(function (producto) { return producto.id !== id; }); };
        this.findProducto = function (id) { return _this.getProductos().find(function (producto) { return producto.id === id; }); };
        this.productos = [];
    }
    return Productos;
}());
exports.Productos = Productos;
