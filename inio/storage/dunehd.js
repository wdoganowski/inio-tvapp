/**
 * Dune HD Inio Storage
 *
 * @author Mautilus s.r.o.
 * @class Inio_Storage_Dunehd
 * @extends Inio_Storage_Default
 */
function Inio_Storage_Dunehd(){
	Inio_Storage_Default.apply(this, arguments);
};

Inio_Storage_Dunehd.prototype.__proto__ = Inio_Storage_Default.prototype;