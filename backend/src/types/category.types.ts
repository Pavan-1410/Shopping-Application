export interface Category {     ////interface here is a TypeScript way to describe the shape of an object.
  category_id: number;          // here Category is the object with following properties
  name: string;                 // consider it as class
}

//हे का?

// Database मध्ये:

// category_id → bigint
// name        → varchar

// आपल्या TypeScript मध्ये:

// category_id → number
// name        → string

// म्हणून database मधून येणाऱ्या category object चा shape आपल्याला माहिती असेल.