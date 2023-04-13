import { useEffect, useState } from "react"
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, FormControlLabel, Input, InputLabel, TextField } from "@mui/material";

export default function AddChar() {
    const [selectedClass, setSelectedClass] = useState('');
    const [classData, setClassData] = useState(undefined);
    const [spells, setSpells] = useState([])

    useEffect(() => {
        if (!selectedClass) return;

        fetch(`api/dndapi?path=classes/${selectedClass}`)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                setClassData(response.data);
            });

        fetch(`api/spells?class=${selectedClass}`) 
            .then(response => response.json())
            .then(response => {
                
                setSpells(response.spells);
            });   

    }, [selectedClass])

    return <>
        <h1>Spell finder</h1>
        <SelectClass setSelectedClass={setSelectedClass} selectedClass={selectedClass} />
        <h2 className="class_title">{classData?.name}</h2>
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
                console.log(response);
                setClasses(response.data.results);
            });
    }, []);

   
    return <FormControl fullWidth> 
        <InputLabel id="demo-simple-select-label">Select class</InputLabel>
            <Select sx={{ color: '#fff'}} value={selectedClass} label="Choose your class" id="demo-simple-select-label" labelId="demo-simple-select-label" onChange={handleChange}>
                {classes?.map(dndClass =>  <MenuItem value={dndClass.index}>{dndClass.name}</MenuItem>)}
                </Select>
        </FormControl>
}

const SpellsFinder = ({spells} : { spells: any[]}) => {
    const [textFilter, setTextFilter] = useState<string>("");
    const [level, setLevel] = useState<string | undefined>();
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
                {[...arr, 'all']?.map(level =>  <MenuItem value={level.toString()}>{level}</MenuItem>)}
         </Select>}
         {spells.length > 0 && schools.size > 0 && <div>
            {Array.from(schools).map(value => 
               <FormControlLabel control={<Checkbox checked={selectedSchools[value] || false} onChange={onChangeSchool} name={value} />} label={value} />
            )}</div>}
         {spells.filter(spell => spell.name.toLowerCase().includes(textFilter.toLowerCase()))
                .filter(spell => {
                    return (level && level !== 'all') ? spell.level.toString().includes(level) : true;
                })
                .filter(spell => {
                    if (!Object.keys(selectedSchools).length || Object.values(selectedSchools).every(school => school === false)) {
                        return true;
                    }
                    return selectedSchools[spell.school.index] 
                        || selectedSchools[spell.school.name.toLowerCase()];

                })
                .map(spell => <Spell spell={spell} />)}
        </>
}

const Spell = ({ spell} : { spell: any}) => {
    const [showExtraInfo, setExtraInfo] = useState<boolean>(false);

    return <div className="spell-wrap" onClick={() => setExtraInfo(!showExtraInfo)}>
        <span className="level">{spell.level}</span>
        <div className="spell-name"><h2>{spell.name}</h2></div>
        <div className="spell-info"><span>{spell.school.name}</span><span>{spell.range}</span></div>
        {showExtraInfo && <>
            <div><p className="damage_type">{spell.damage?.damage_type.name}</p></div>
            <div><p className="damage_at_levels">{spell.damage?.damage_at_character_level && <>
                <p>Damage at levels:</p>
            {Object.keys(spell.damage.damage_at_character_level).map(key => {
                return <p className="damage_at_level">{key}: {spell.damage.damage_at_character_level[key]}</p>
            })}
            </>}
            </p></div>
            {spell?.desc.map((description: string) => <p className="spell-description-line">{description}</p>)}
        
        
        </>}        
    </div>
}