import { Configuration, OpenAIApi } from "openai";
import { load } from 'cheerio';
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";

const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://dungeonsdragons-f84ec-default-rtdb.europe-west1.firebasedatabase.app",
  };

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const notInSRD = [
`Arcane Gate`,
`Armor of Agathys`,
`Arms of Hadar`,
`Aura of Life`,
`Aura of Purity`,
`Aura of Vitality`,
`Banishing Smite`,
`Beast Sense`,
`Blade Ward`,
`Blinding Smite`,
`Branding Smite`,
`Chromatic Orb`,
`Circle of Power`,
`Cloud of Daggers`,
`Compelled Duel`,
`Compulsion`,
`Conjure Barrage`,
`Conjure Volley`,
`Cordon of Arrows`,
`Counterspell`,
`Crown of Madness`,
`Crusader's Mantle`,
`Destructive Wave`,
`Dissonant Whispers`,
`Druidcraft`,
`Eldritch Blast`,
`Elemental Weapon`,
`Ensnaring Strike`,
`Feign Death`,
`Find Familiar`,
`Fire Bolt`,
`Friends`,
`Goodberry`,
`Grasping Vine`,
`Guardian of Faith`,
`Hail of Thorns`,
`Hellish Rebuke`,
`Hex`,
`Hunger of Hadar`,
`Hunter's Mark`,
`Levitate`,
`Lightning Arrow`,
`Phantasmal Force`,
`Poison Spray`,
`Power Word Heal`,
`Ray of Sickness`,
`Searing Smite`,
`Spare the Dying`,
`Staggering Smite`,
`Swift Quiver`,
`Telepathy`,
`Thorn Whip`,
`Thunderous Smite`,
`Tsunami`,
`Vicious Mockery`,
`Witch Bolt`,
`Wrathful Smite`,
]


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) {
    
    const dndClass = req.query.class;
    let promises = [];

    ['Arcane Gate'].forEach(async (name, i) => {
        const prompt = `
        Give me the details for the following dungeons and dragons spell ${name}
        - name
        - classes comma seperated
        - spell level
        - spell school name
        - spell damage type
        - spell damage
        - spell damage at level 1, 5, 11, 17
        - range of the spell
        - spell description
    `;
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        max_tokens: 4000
    });
    const spell = completion.data.choices[0].message.content;
    
            const spellObj = {
            name: getTextBetween('Name', 'Classes', spell).trim(),
            classes: getTextBetween('Classes:', 'Spell Level', spell, 'Level').trim(),
            level: getTextBetween('Spell Level:', 'Spell School', spell).split(','),
            damage: {
                damage_at_character_level: {
                    1: getTextBetween('Level 1:', 'Level 5', spell).replace('Spell Damage at', '').replace('Spell damage at', '').trim() || '',
                    5: getTextBetween('Level 5:', 'Level 11', spell).replace('Spell Damage at', '').replace('Spell damage at', '').trim() || '',
                    11: getTextBetween('Level 11:', 'Level 17', spell).replace('Spell Damage at', '').replace('Spell damage at', '').trim() || '',
                    17: getTextBetween('Level 17:', 'Range', spell).replace('Spell Damage at', '').replace('Spell damage at', '').trim() || ''
                },
                damage_levels: getTextBetween('at level 1, 5, 11, 17:', 'Range', spell, 'Spell Range').replace('Spell', '').replace('spell', '').trim() || '',
                damage_type: {
                    name: getTextBetween('Spell Damage Type:', 'Spell damage:', spell, 'Spell damage type', true)
                }
            },
            school: {
                name: getTextBetween('Spell School', 'Spell Damage Type', spell, 'Level 1:').replace(':', '').replace('Name', '').replace('name', '').trim()
            },
            range: getTextBetween('Range', 'Spell Description', spell, 'Description').replace('of the Spell', '').replace('of Spell', ''),
            desc: [getTextBetween('Description:', '', spell)]
        }

        if (spellObj.name) {
            setTimeout(() => {
                saveSpell(spellObj)
            }, 100)
        }

        
    })

    // const completion = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [{role: "user", content: prompt}],
    //     max_tokens: 4000
    // });

    // await Promise.all(promises).then(responses => {
    //     response.forEach((completion, i) => {
    //         console.log('response', i)
    //         const spell = completion.data.choices[0].message.content;
    
    //         const spellObj = {
    //         name: getTextBetween('Name', 'Classes', spell).trim(),
    //         classes: getTextBetween('Classes:', 'Spell Level', spell, 'Level').trim(),
    //         level: getTextBetween('Spell Level:', 'Spell School', spell).split(','),
    //         damage: {
    //             damage_at_character_level: {
    //                 1: getTextBetween('Level 1:', 'Level 5', spell).replace('Spell Damage at', '').replace('Spell damage at', '').trim() || '',
    //                 5: getTextBetween('Level 5:', 'Level 11', spell).replace('Spell Damage at', '').replace('Spell damage at', '').trim() || '',
    //                 11: getTextBetween('Level 11:', 'Level 17', spell).replace('Spell Damage at', '').replace('Spell damage at', '').trim() || '',
    //                 17: getTextBetween('Level 17:', 'Range', spell).replace('Spell Damage at', '').replace('Spell damage at', '').trim() || ''
    //             },
    //             damage_levels: getTextBetween('at level 1, 5, 11, 17:', 'Range', spell, 'Spell Range').replace('Spell', '').replace('spell', '').trim() || '',
    //             damage_type: {
    //                 name: getTextBetween('Spell Damage Type:', 'Spell damage:', spell, 'Spell damage type', true)
    //             }
    //         },
    //         school: {
    //             name: getTextBetween('Spell School', 'Spell Damage Type', spell, 'Level 1:').replace(':', '').replace('Name', '').replace('name', '').trim()
    //         },
    //         range: getTextBetween('Range', 'Spell Description', spell, 'Description').replace('of the Spell', '').replace('of Spell', ''),
    //         desc: [getTextBetween('Description:', '', spell)]
    //     }

    //     saveSpell(spellObj)
    //     });
    // });

    //console.log(completion.data.choices)
    

    //return res.status(200).json({ message: spellObj });
};

function saveSpell(spell, i) {

    // Initialize Firebase
      const app = initializeApp(firebaseConfig);

      console.log('saving...', spell.name, i, notInSRD.length);
      // Initialize Realtime Database and get a reference to the service
      const database = getDatabase(app);
      set(ref(database, 'spells/' + spell.name), spell);
}

function getTextBetween(start, end, full, secondGuess = '', log = false) {
    const startFound = full.toLowerCase().indexOf(start.toLowerCase());
    
    let startIndex = start !== '' ? (startFound !== -1 ? startFound + start.length : -1) : 0;
    let endIndex = end !== '' ? full.toLowerCase().indexOf(end.toLowerCase()) : full.length;
    
    if (startIndex === -1 || endIndex === -1) {
      return '';
    }

    let result = full.substring(startIndex, endIndex);
  
    if (result.length > 130 && secondGuess !== '') {
      let startIndex = start !== '' ? full.indexOf(secondGuess) + secondGuess.length : 0;
      let endIndex = end !== '' ? full.indexOf(end) : full.length;
      // console.log(startIndex, endIndex, full.substring(startIndex, endIndex))
      if (startIndex === -1 || endIndex === -1) {
        return '';
      }
      result = full.substring(startIndex, endIndex);
    }
  
    return result.replace('-', '').replace(':', '').trim();
  } 