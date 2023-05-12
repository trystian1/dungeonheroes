import { Button, Card, Col, Container, Grid, Link, Row, Text } from "@nextui-org/react";
;

export const players : Player[] = [
    {
        name: 'Gepetto',
        classDnd: 'Sorcerer',
        level: 6
    },
    {
        name: 'Immor',
        classDnd: 'Warlock',
        level: 6
    },
    {
        name: 'Switch',
        classDnd: 'Rogue',
        level: 6
    },
    {
        name: 'Baroet',
        classDnd: 'Barbarian',
        level: 6
    }
]

type Player = {
    name: string,
    classDnd: string,
    level: number
}



export default function Home() {
    
    return (<Container>
        
        <h1>Dungeons and Dragons</h1>
        <Button css={{marginBottom: '20px'}}>
        <Link
          css={{color: 'white'}}
          href={`/spells`}
        >
          Spell finder
        </Link>
        </Button>
        {players.map(player => <PlayerCard key={player.name} {...player} />)}
  
        </Container>
    
    
    
    )

}

const PlayerCard = ({ name, classDnd, level} : Player) => {
    return <Card css={{ p: "$6", mw: "400px", marginBottom:'20px' }}>
      <Card.Header>
        <img
          alt="nextui logo"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width="34px"
          height="34px"
        />
        <Grid.Container css={{ pl: "$6" }}>
          <Grid xs={12}>
            <Text h4 css={{ lineHeight: "$xs" }}>
              {name}
            </Text>
          </Grid>
          <Grid xs={12}>
            <Text css={{ color: "$accents8" }}>level: {level}</Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: "$2" }}>
        <Text>
          Level {level} {classDnd}
        </Text>
      </Card.Body>
      <Card.Footer>
        <Link
          color="primary"
          href={`/${name}/player`}
        >
          Visit personal page
        </Link>
      </Card.Footer>
    </Card>
}

export const Card4 = ({ name, classDnd, level} : Player) => (
    <Card css={{ w: "100%", h: "400px", marginBottom:'50px' }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
          Level {level} {classDnd}
          </Text>
          <Text h3 color="black">
            {name}
          </Text>
        </Col>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src="https://nextui.org/images/card-example-6.jpeg"
          width="100%"
          height="100%"
          objectFit="cover"
          alt="Card example background"
        />
      </Card.Body>
      <Card.Footer
        isBlurred
        css={{
          position: "absolute",
          bgBlur: "#ffffff66",
          borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Row>
          <Col>
          </Col>
          <Col>
            <Row justify="flex-end">
              <Button flat auto rounded color="secondary">
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  To Page
                </Text>
              </Button>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );