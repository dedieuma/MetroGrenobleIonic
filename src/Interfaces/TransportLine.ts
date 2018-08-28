

export interface TransportLineProperties {
    NUMERO: string;
    CODE: string;
    COULEUR: string;
    COULEUR_TEXTE: string;
    PMR: number;
    LIBELLE: string;
    ZONES_ARRET: string[];
    type: string;
    id: string;
    shape: string[];
}

export interface Feature {
    properties: TransportLineProperties;
}

export interface TransportLine {
    type: string;
    features: Feature[];
}



