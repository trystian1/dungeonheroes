import { players } from "@/pages/home";
import { Spell, SpellsFinder } from "@/pages/spells";
import { Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

type Props = {
    classDnd: string;
    name: string
    level: number,
    userSpellsFetch: any[]
}

export default function Home({ classDnd, name, level, userSpellsFetch } : Props) {
    const [spells, setSpells] = useState([]);
    const [userSpells, setUserSpells] = useState<any>(userSpellsFetch || [])

    console.log(classDnd, level, name)

    useEffect(() => {
        fetch(`/api/spells-user?name=${name}`) 
        .then(response => response.json())
        .then(response => {
            console.log(response.spells);
            setUserSpells(response.spells);
        });
    }, []);

    useEffect(() => {
        console.log(classDnd);
        fetch(`/api/spells?class=${classDnd.toLowerCase()}`) 
        .then(response => response.json())
        .then(response => {
            
            setSpells(response.spells);
            
        });
    }, [])

    const updateUserSpells = (spellObj: any) => {
        setUserSpells([...userSpells, spellObj]);
    }

    return (<>
        <Button css={{marginBottom: '20px'}}>
        <Link
          css={{color: 'white'}}
          href={`/home`}
        >
          home
        </Link>
        </Button>
    <h1>{name}</h1>
    <div>
        {Array.from(Array(10).keys()).map(level => {
            return <SpellView key={level} spells={spells} level={level} name={name} userSpells={userSpells} updateUserSpells={updateUserSpells}/>
            
        })}
    </div>
   
    </>
    
    )

}

const SpellView = ({ spells, level, name, userSpells, updateUserSpells} : { spells: any[], level: number, name: string, userSpells: any[], updateUserSpells: any}) => {
    const [showAddSpell, setShowAddSpell] = useState(false);
    const userSpellsFiltered = userSpells.filter(data => data.level == level);
    const onAddSpell = async (spell: any) => {
        console.log(spell);
        setShowAddSpell(false);
        const data = {
            spell,
            level,
            name
        }
        updateUserSpells(data);
        const response = await fetch('/api/save-user', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data type must match "Content-Type" header
          });
          
    }

    return <>
    <h2>Level {level}</h2>
    <Button css={{ marginBottom: '10px'}}onClick={() => setShowAddSpell(true)}> Add spell</Button>
    {userSpellsFiltered.map(data => <Spell key={data.spell.name} spell={data.spell} />)}
    {showAddSpell && <Button onClick={() => setShowAddSpell(false)}>Hide spell select</Button>}
    {showAddSpell && <SpellsFinder filterLevel={`${level}`} spells={spells} addSpell={onAddSpell} showAddButton={true} />}
    </>
}

export async function getServerSideProps(context: any) {

    console.log(context.params.id);
    const player = players.filter(player => player.name === context.params.id)[0]
    return {
      props: {
        ...player
      }, // will be passed to the page component as props
    };
  }