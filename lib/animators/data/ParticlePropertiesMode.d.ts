/**
 * Options for setting the properties mode of a particle animation node.
 */
export declare class ParticlePropertiesMode {
    /**
     * Mode that defines the particle node as acting on global properties (ie. the properties set in the node constructor or the corresponding animation state).
     */
    static GLOBAL: number;
    /**
     * Mode that defines the particle node as acting on local static properties (ie. the properties of particles set in the initialising on the animation set).
     */
    static LOCAL_STATIC: number;
    /**
     * Mode that defines the particle node as acting on local dynamic properties (ie. the properties of the particles set in the corresponding animation state).
     */
    static LOCAL_DYNAMIC: number;
}
