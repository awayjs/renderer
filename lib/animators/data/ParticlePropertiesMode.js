"use strict";
/**
 * Options for setting the properties mode of a particle animation node.
 */
var ParticlePropertiesMode = (function () {
    function ParticlePropertiesMode() {
    }
    /**
     * Mode that defines the particle node as acting on global properties (ie. the properties set in the node constructor or the corresponding animation state).
     */
    ParticlePropertiesMode.GLOBAL = 0;
    /**
     * Mode that defines the particle node as acting on local static properties (ie. the properties of particles set in the initialising on the animation set).
     */
    ParticlePropertiesMode.LOCAL_STATIC = 1;
    /**
     * Mode that defines the particle node as acting on local dynamic properties (ie. the properties of the particles set in the corresponding animation state).
     */
    ParticlePropertiesMode.LOCAL_DYNAMIC = 2;
    return ParticlePropertiesMode;
}());
exports.ParticlePropertiesMode = ParticlePropertiesMode;
