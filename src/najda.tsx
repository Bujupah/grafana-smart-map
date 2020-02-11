export interface User {
    nom: string;
    prenom: string;
    image: string;
    email: string;
    telephone: string;
    isAuthority: number;
}

export interface Reclamation {
    commentaire: string;
    longitude: number;
    latitude: number;
    recDatetime: Date;
    confirmed: number;
    genre: string;
    user: User;
}