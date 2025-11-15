export interface BonusPart {
  question: string;
  answer: string;
  value: number;
  difficultyModifier?: string;
}

export interface Bonus {
  _id: string;
  leadin: string;
  parts: BonusPart[];
  category: string;
  subcategory: string;
  alternateSubcategory?: string;
  difficulty?: number;
  set: {
    year: number;
    name: string;
  };
  packet: {
    number: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  count: number;
  subcategories?: string[];
}

export interface QBReaderQueryResponse {
  bonuses: {
    count: number;
    questionArray: Bonus[];
  };
  queryString: string;
}

export interface QBReaderRandomBonusResponse {
  bonuses: Bonus[];
}
