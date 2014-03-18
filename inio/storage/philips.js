/**
 * Philips Inio Storage
 *
 * @author Mautilus s.r.o.
 * @class Inio_Storage_Philips
 * @extends Inio_Storage_Default
 */
function Inio_Storage_Philips(){
	Inio_Storage_Default.apply(this, arguments);
};

Inio_Storage_Philips.prototype.__proto__ = Inio_Storage_Default.prototype;