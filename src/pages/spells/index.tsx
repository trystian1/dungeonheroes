import { useEffect, useState } from "react"
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, FormControlLabel, Input, InputLabel, TextField } from "@mui/material";
import { Button, Link } from "@nextui-org/react";

export default function AddChar() {
    const [selectedClass, setSelectedClass] = useState('');
    const [classData, setClassData] = useState<any>(undefined);
    const [spells, setSpells] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!selectedClass) return;
        setIsLoading(true);
        setSpells([]);
        setClassData(undefined);

        fetch(`api/dndapi?path=classes/${selectedClass}`)
            .then(response => response.json())
            .then(response => {
                console.log(response.data);
                setClassData(response.data);
            });
        console.log(selectedClass);
        fetch(`api/spells?class=${selectedClass}`) 
            .then(response => response.json())
            .then(response => {
                setSpells(response.spells);
                setIsLoading(false);
            });   

    }, [selectedClass])

    return <>
        <Button css={{marginBottom: '20px'}}>
        <Link
          css={{ color: 'white '}}
          href={`/home`}
        >
          Home
        </Link>
        </Button>
        <h1>Spell finder</h1>
        <SelectClass setSelectedClass={setSelectedClass} selectedClass={selectedClass} />
        <h2 className="class_title">{classData?.name}</h2>
        {isLoading && <p>Loading.......</p>}
        <SpellsFinder spells={spells} />    
    </>
}

type DndClass = {
    name: string;
    index: string
}


const SelectClass = ({ setSelectedClass, selectedClass }: {setSelectedClass: any, selectedClass: string}) => {
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
  };

    const [classes, setClasses] = useState<DndClass[]>([]);
    useEffect(() => {
        fetch('api/dndapi?path=classes')
            .then(response => response.json())
            .then(response => {
                setClasses([...response.data.results, { name: 'All', index: 'all' }]);
            });
    }, []);

   
    return <FormControl fullWidth> 
        <InputLabel id="demo-simple-select-label">Select class</InputLabel>
            <Select sx={{ color: '#fff'}} value={selectedClass} label="Choose your class" id="demo-simple-select-label" labelId="demo-simple-select-label" onChange={handleChange}>
                {classes?.map((dndClass: any, i: number) =>  <MenuItem key={i} value={dndClass.index}>{dndClass.name}</MenuItem>)}
                </Select>
        </FormControl>
}

export const SpellsFinder = ({spells, showAddButton = false, addSpell = () => {}, filterLevel} : { spells: any[], showAddButton?: boolean, addSpell?: any, filterLevel?: string}) => {
    const [textFilter, setTextFilter] = useState<string>("");
    const [level, setLevel] = useState<string | undefined>(filterLevel);
    const [selectedSchools, setSchools] = useState<{[key: string]: boolean}>({});

    const onChangeSchool = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSchools({
            ...selectedSchools,
            [event?.target.name]: event?.target.checked
        })
    }
    let arr = Array.from(Array(10).keys());
    const schools = new Set(spells.map(spell => spell.school.index));
    console.log(spells);
    return <>
         {spells.length > 0 && <TextField value={textFilter} onChange={evt => setTextFilter(evt.target.value)} id="outlined-basic" label="Search spell" variant="outlined" />}
         {spells.length > 0 &&<Select sx={{ color: '#fff', marginLeft:'10px', width: '100px'}} value={level} label="Lvl" id="demo-simple-select-label" labelId="demo-simple-select-label" onChange={evt => setLevel(evt.target.value)}>
                {[...arr, 'all']?.map(level =>  <MenuItem key={level.toString()} value={level.toString()}>{level}</MenuItem>)}
         </Select>}
         
         {spells.length > 0 && schools.size > 0 && <div>
            {Array.from(schools).map(value => 
               <FormControlLabel key={value} control={<Checkbox checked={selectedSchools[value] || false} onChange={onChangeSchool} name={value} />} label={value} />
            )}</div>}
         {spells.filter(spell => spell.name.toLowerCase().includes(textFilter.toLowerCase()))
                .filter(spell => {
                    return (level && level !== 'all') 
                        ? spell.level.toString().includes(level) 
                        : true;
                })
                .filter(spell => {
                    if (!Object.keys(selectedSchools).length || Object.values(selectedSchools).every(school => school === false)) {
                        return true;
                    }
                    return selectedSchools[spell.school.index] 
                        || selectedSchools[spell.school.name.toLowerCase()];

                })
                .map((spell, i) => <Spell key={`${i}_${spell.name}`} spell={spell} showAddButton={showAddButton} addSpell={addSpell}/>)}
        </>
}

export const Spell = ({ spell, showAddButton = false, addSpell = () => {}} : { spell: any, showAddButton?: boolean, addSpell?: any}) => {
    const [showExtraInfo, setExtraInfo] = useState<boolean>(false);

    return <div className="spell-wrap" onClick={() => setExtraInfo(!showExtraInfo)}>
        <span className="level">{spell.level}</span>
        <div className="spell-name"><h2>{spell.name}</h2></div>
        <div className="spell-info"><span>{spell.school.name}</span><span>{spell.range}</span></div>
        {showAddButton && <Button onClick={() => addSpell(spell)}>Add spell</Button>}
        {showExtraInfo && <>
            <div><p className="damage_type">{spell.damage?.damage_type.name}</p></div>
            <div><p className="damage_at_levels">{spell.damage?.damage_at_character_level && <>
                <p>Damage at levels:</p>
            {Object.keys(spell.damage.damage_at_character_level).map(key => {
                const damageAtLevel = spell.damage.damage_at_character_level[key];
                if (damageAtLevel === 'None' || damageAtLevel == 'N/A') {
                    return null;
                }
                return <p key={key} className="damage_at_level">{key}: {damageAtLevel}</p>
            })}
            </>}
            </p></div>
            {spell?.desc.map((description: string, i: number) => <p key={i} className="spell-description-line">{description}</p>)}
        
        
        </>}        
    </div>
}