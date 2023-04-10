import { FC, useLayoutEffect } from 'react';
import { useEffect, useRef, useState } from 'react';

// import './Game.scss';

const MAP_SIZE = 900;
const NUBER_CARDS = 40;
const SIZE_CORNER_CARDS = 13; // процент размера угловых карточек относительно поля
const SPEED_ANIMATION = 5;

const cardHeight = Math.round((MAP_SIZE / 100) * SIZE_CORNER_CARDS);
const cardWidth = Math.round(
    (MAP_SIZE / 100) * ((100 - SIZE_CORNER_CARDS * 2) / ((NUBER_CARDS - 4) / 4)),
);
const centerZone = {
    x: cardHeight,
    y: cardHeight,
    width: MAP_SIZE - cardHeight * 2,
    height: MAP_SIZE - cardHeight * 2
}


export const Game = () => {

    const canvasRef = useRef();

    const [shouldStop, setShouldStop] = useState(true);
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);


    const [counter, setCounter] = useState(0);
    /// целевая позиция
    const [targetX, setTargetX] = useState(0);
    const [targetY, setTargetY] = useState(0);

    const [countSteps, setCountSteps] = useState(0);

    const cards = readyPositionCards(NUBER_CARDS, cardWidth, cardHeight);

    const playerGo = () => {

        const card = prompt('Номер клетки для передвижения от 0 до 39') ?? 0;
        const [x, y] = cards[card];
        setTargetX(x);
        setTargetY(y);
        setShouldStop(false);
    };


    // output graphics
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = MAP_SIZE;
        canvas.height = MAP_SIZE;

        const context = canvas.getContext('2d')

        context.clearRect(0, 0, 350, 350)
        cards.forEach((item) => context.strokeRect(...item));


        if (playerAnimationSteps(positionX, setPositionX, positionY, setPositionY, targetX, targetY, SPEED_ANIMATION, centerZone.width)) {
            setShouldStop(true);
        }


        context.fillStyle = '#555555'
        context.fillRect(positionX, positionY, 18, 18)


    }, [counter]);

    // update the counter
    useLayoutEffect(() => {
        if (!shouldStop) {
            let timerId

            const animate = () => {

                setCounter(c => c + 1)

                timerId = requestAnimationFrame(animate)
            }
            timerId = requestAnimationFrame(animate)
            return () => cancelAnimationFrame(timerId)
        }
    }, [shouldStop]);




    return <>
        <button onClick={playerGo}>GO-PLAYER</button>
        {/* <Button onClick={playerGo2}>GO-RED</Button> */}
        <canvas ref={canvasRef} />
    </>;
};




export const useAnimation = (animationFunction, fps = 60) => {
    const [shouldStop, setShouldStop] = useState(true);
    const [counter, setCounter] = useState(0);
    const canvasRef = useRef();
    const frameRef = useRef();
    const startTimeRef = useRef();

    // function to handle animation
    const animationLoop = (timestamp) => {
        if (!startTimeRef.current) {
            startTimeRef.current = timestamp;
        }

        const timeElapsed = timestamp - startTimeRef.current;

        const frameNumber = Math.round(fps * (timeElapsed / 1000));

        animationFunction(frameNumber);

        if (!shouldStop) {
            frameRef.current = requestAnimationFrame(animationLoop);
            setCounter(frameNumber);
        }
    };

    const startAnimation = () => {
        setShouldStop(false);
        frameRef.current = requestAnimationFrame(animationLoop);
    };

    const stopAnimation = () => {
        setShouldStop(true);
        cancelAnimationFrame(frameRef.current);
        startTimeRef.current = null;
        setCounter(0);
    };

    return { startAnimation, stopAnimation, counter, canvasRef };
};




export const readyPositionCards = (count: number, cardWidth: number, cardHeight: number) => {
    const map = [];
    let stepX = 0;
    let stepY = 0;

    for (let i = 0; i < count; i++) {
        const { width, height } = determineSizeOfSide(i, cardWidth, cardHeight);
        const card = [stepX, stepY, width, height];
        if (i === 0) {
            stepX = width;
        } else if (i === 10) {
            stepY += height;
        } else if (i === 20) {
            stepX -= cardWidth;
        } else if (i === 30) {
            stepX = 0;
            card[0] = stepX;
            stepY -= cardWidth;
        } else if (i > 0 && i < 10) {
            stepX += width;
        } else if (i > 10 && i < 20) {
            stepY += height;
        } else if (i > 20 && i < 30) {
            stepX -= width;
        } else if (i > 30 && i < 40) {
            stepY -= height;
        }
        map[i] = card;
    }
    return map;
};

function determineSizeOfSide(i: number, baseWidth: number, baseHeight: number) {
    if ((i > 0 && i < 10) || (i > 20 && i < 30)) return { width: baseWidth, height: baseHeight };
    if ((i > 10 && i < 20) || (i > 30 && i < 40)) return { width: baseHeight, height: baseWidth };

    return { width: baseHeight, height: baseHeight };
}


export const playerAnimationSteps = (x, setX, y, setY, targetX, targetY, speed, MAP_SIZE) => {
    speed = resetSpeedPlayer(x, y, targetX, targetY) ? 1 : speed;


    if (x < targetX ) {
        setX(x => x + speed);
    } else if (y < targetY) {
        setY(y => y + speed);
    } else if (x > targetX) {
        setX(x => x - speed);
    } else if (y > targetY) {
        setY(y => y - speed);
    } else {
        return true;
    }
    return false;
}



const resetSpeedPlayer = (x, y, tX, tY) => {
    if (((x - tX) < 20 && (x - tX) > -20) && ((y - tY) < 20 && (y - tY) > -20)) return true;
}
