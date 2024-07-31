const content = document.querySelector('#content-box') as HTMLElement;
const result = document.querySelector('#result-message') as HTMLElement;
const showAddFormBtn = document.querySelector('#show-add-form-btn') as HTMLButtonElement;

const popUpAdd = document.querySelector('#popUp-add') as HTMLElement;
const kindOfAnimal = document.querySelector('#kind-of-animal') as HTMLSelectElement;
const errorMessage = document.querySelector('#error-message') as HTMLParagraphElement;
const animalName = document.querySelector('#animal-name') as HTMLInputElement;
const animalAge = document.querySelector('#animal-age') as HTMLInputElement;
const saveBtn = document.querySelector('#save-btn') as HTMLButtonElement;
const cancelBtn = document.querySelector('#cancel-btn') as HTMLButtonElement;

interface IAnimal {
    name: string;
    age: number;
    get health(): number;
    get mood(): number;
    get satiety(): number;
    set context(context: Context);
    setPropertiesToZero(): void;
    feed(): void;
    treat(): void;
    play(): void;
};

interface IStrategy {
    changeProperty: (propertyValue: number, isIncrease: boolean) => number;
};

class YoungAnimal implements IStrategy {

    changeProperty(propertyValue: number, isIncrease: boolean): number {
        return isIncrease ? propertyValue + 10 : propertyValue - 2;
    };
};

class AdultAnimal implements IStrategy {

    changeProperty(propertyValue: number, isIncrease: boolean): number {
        return isIncrease ? propertyValue + 5 : propertyValue - 5;
    };
};

class OldAnimal implements IStrategy {

    changeProperty(propertyValue: number, isIncrease: boolean): number {
        return isIncrease ? propertyValue + 2 : propertyValue - 10;
    };
};

class Context {

    private _strategy: IStrategy;

    constructor(age: number) {
        this._strategy = this.setDefaultStrategy(age);
    };

    public setDefaultStrategy(age: number): IStrategy {
        if (age >= 0 && age <= 5) {
            return new YoungAnimal();
        } else if (age >= 10) {
            return new OldAnimal();
        } else {
            return new AdultAnimal();
        };
    };

    public setStrategy(strategy: IStrategy): void {
        this._strategy = strategy;
    };

    public changeProperty(propertyValue: number, isIncrease: boolean): number {
        return this._strategy.changeProperty(propertyValue, isIncrease);
    };
};

abstract class AnimalCreator {

    public abstract factoryMethod(name: string, age: number): IAnimal;

    public feed(name: string, age: number): void {
        const animal = this.factoryMethod(name, age);
        animal.feed();
    };

    public treat(name: string, age: number): void {
        const animal = this.factoryMethod(name, age);
        animal.treat();
    };

    public play(name: string, age: number): void {
        const animal = this.factoryMethod(name, age);
        animal.play();
    };
};

class RandomNumber {

    public generateNumber: (max: number, min: number) => number = (max: number, min: number): number => {
        if (max >= min) {
            return Math.floor(Math.random() * (max - min) + min);
        } else {
            return Math.floor(Math.random() * (min - max) + max);
        };
    };
};

class Cat implements IAnimal {

    private _context: Context;
    private _random: RandomNumber;
    private _satiety: number;
    private _health: number;
    private _mood: number;

    name: string;
    age: number;

    constructor(name: string, age: number) {

        this.name = name;
        this.age = age;
        this._context = new Context(this.age);
        this._random = new RandomNumber();
        this._satiety = 0;
        this._health = 0;
        this._mood = 0;
    };

    public get context() {
        return this._context;
    };

    public set context(context: Context) {
        this._context = context;
    };

    public get satiety(): number {
        return this._satiety;
    };

    public set satiety(satiety: number) {
        this._satiety = satiety;
    };

    public get health(): number {
        return this._health;
    };

    public set health(health: number) {
        this._health = health;
    };

    public get mood(): number {
        return this._mood;
    };

    public set mood(mood: number) {
        this._mood = mood;
    };

    private _increseHealthAndMood(): void {
        this.health = this.context.changeProperty(this.health, true);
        this.mood = this.context.changeProperty(this.mood, true);
    };

    private _decreseHealthAndMood(): void {
        this.health = this.context.changeProperty(this.health, false);
        this.mood = this.context.changeProperty(this.mood, false);
    };

    private _reactAccident(): void {
        this._decreseHealthAndMood();
        this._decreseHealthAndMood();
    };

    public feed(): void {
        if (this.satiety > 100) {
            result.innerText = `Кошка(кот) ${this.name} переел и ее(его) стошнило.`;
            this._decreseHealthAndMood();
            return;
        };
        let randomNumber = this._random.generateNumber(12, 1);

        if (randomNumber === 1) {
            result.innerText = `Корм был не свежим... Ваш питомец ${this.name} отравился.`;
            this._reactAccident();
        } else {
            this._increseHealthAndMood();
            this.satiety = this.context.changeProperty(this.satiety, true);
            result.innerText = `Кошка(кот) ${this.name} хорошо поел(а).`;
        };
    };

    public treat(): void {
        if (this.health > 100) {
            let randomNumber = this._random.generateNumber(2, 1);
            if (randomNumber === 1) {
                result.innerText = `Кошка(кот) ${this.name} получил(а) передозировку лекарств.`;
                this.satiety = this.context.changeProperty(this.satiety, false);
                this._reactAccident();
                return;
            };
        };
        this._increseHealthAndMood();
        result.innerText = `Кошке(коту) ${this.name} уже лучше.`;
    };

    public play(): void {
        if (this.satiety < 0) {
            result.innerText = `Кошка(кот) ${this.name} не хочет играть, а хочет есть.`;
            return;
        };
        let randomNumber = this._random.generateNumber(12, 1);

        if (randomNumber === 1) {
            result.innerText = `В процессе игры Ваш питомец ${this.name} получил травму...`;
            this._reactAccident();
        } else {
            this._increseHealthAndMood();
            this.satiety = this.context.changeProperty(this.satiety, false);
            result.innerText = `Кошка(кот) ${this.name} хорошо поиграл(а).`;
        };
    };

    public setPropertiesToZero(): void {
        this.satiety = 0;
        this.mood = 0;
        this.health = 0;
    };
};

class Dog implements IAnimal {

    private _context: Context;
    private _random: RandomNumber;
    private _satiety: number;
    private _health: number;
    private _mood: number;

    name: string;
    age: number;

    constructor(name: string, age: number) {

        this.name = name;
        this.age = age;
        this._context = new Context(this.age);
        this._random = new RandomNumber();
        this._satiety = 0;
        this._health = 0;
        this._mood = 0;
    };

    public get context() {
        return this._context;
    };

    public set context(context: Context) {
        this._context = context;
    };

    public get satiety(): number {
        return this._satiety;
    };

    public set satiety(satiety: number) {
        this._satiety = satiety;
    };

    public get health(): number {
        return this._health;
    };

    public set health(health: number) {
        this._health = health;
    };

    public get mood(): number {
        return this._mood;
    };

    public set mood(mood: number) {
        this._mood = mood;
    };

    private _increseHealthAndMood(): void {
        this.health = this.context.changeProperty(this.health, true);
        this.mood = this.context.changeProperty(this.mood, true);
    };

    private _decreseHealthAndMood(): void {
        this.health = this.context.changeProperty(this.health, false);
        this.mood = this.context.changeProperty(this.mood, false);
    };

    private _reactAccident(): void {
        this._decreseHealthAndMood();
        this._decreseHealthAndMood();
    };

    public feed(): void {
        if (this.satiety > 100) {
            result.innerText = `Собака ${this.name} переела и ее стошнило.`;
            this._decreseHealthAndMood();
            return;
        };
        let randomNumber = this._random.generateNumber(12, 1);

        if (randomNumber === 1) {
            result.innerText = `Корм был не свежим... Ваш питомец ${this.name} отравился.`;
            this._reactAccident();
        } else {
            this._increseHealthAndMood();
            this.satiety = this.context.changeProperty(this.satiety, true);
            result.innerText = `Собака ${this.name} хорошо поела.`;
        };
    };

    public treat(): void {
        if (this.health > 100) {
            let randomNumber = this._random.generateNumber(2, 1);
            if (randomNumber === 1) {
                result.innerText = `Собака ${this.name} получила передозировку лекарств.`;
                this.satiety = this.context.changeProperty(this.satiety, false);
                this._reactAccident();
                return;
            };
        };
        this._increseHealthAndMood();
        result.innerText = `Собаке ${this.name} уже лучше.`;
    };

    public play(): void {
        if (this.satiety < 0) {
            result.innerText = `Собака ${this.name} не хочет играть, а хочет есть.`;
            return;
        };
        let randomNumber = this._random.generateNumber(12, 1);

        if (randomNumber === 1) {
            result.innerText = `В процессе игры Ваш питомец ${this.name} получил травму...`;
            this._reactAccident();
        } else {
            this._increseHealthAndMood();
            this.satiety = this.context.changeProperty(this.satiety, false);
            result.innerText = `Собака ${this.name} хорошо поиграла.`;
        };
    };

    public setPropertiesToZero(): void {
        this.satiety = 0;
        this.mood = 0;
        this.health = 0;
    };
};

class Fox implements IAnimal {

    private _context: Context;
    private _random: RandomNumber;
    private _satiety: number;
    private _health: number;
    private _mood: number;

    name: string;
    age: number;

    constructor(name: string, age: number) {

        this.name = name;
        this.age = age;
        this._context = new Context(this.age);
        this._random = new RandomNumber();
        this._satiety = 0;
        this._health = 0;
        this._mood = 0;
    };

    public get context() {
        return this._context;
    };

    public set context(context: Context) {
        this._context = context;
    };

    public get satiety(): number {
        return this._satiety;
    };

    public set satiety(satiety: number) {
        this._satiety = satiety;
    };

    public get health(): number {
        return this._health;
    };

    public set health(health: number) {
        this._health = health;
    };

    public get mood(): number {
        return this._mood;
    };

    public set mood(mood: number) {
        this._mood = mood;
    };

    private _increseHealthAndMood(): void {
        this.health = this.context.changeProperty(this.health, true);
        this.mood = this.context.changeProperty(this.mood, true);
    };

    private _decreseHealthAndMood(): void {
        this.health = this.context.changeProperty(this.health, false);
        this.mood = this.context.changeProperty(this.mood, false);
    };

    private _reactAccident(): void {
        this._decreseHealthAndMood();
        this._decreseHealthAndMood();
    };

    public feed(): void {
        if (this.satiety > 100) {
            result.innerText = `Лис(а) ${this.name} переел(а) и его (ее) стошнило.`;
            this._decreseHealthAndMood();
            return;
        };
        let randomNumber = this._random.generateNumber(12, 1);

        if (randomNumber === 1) {
            result.innerText = `Корм был не свежим... Ваш питомец ${this.name} отравился.`;
            this._reactAccident();
        } else {
            this._increseHealthAndMood();
            this.satiety = this.context.changeProperty(this.satiety, true);
            result.innerText = `Лис(а) ${this.name} хорошо поел(а).`;
        };
    };

    public treat(): void {
        if (this.health > 100) {
            let randomNumber = this._random.generateNumber(2, 1);
            if (randomNumber === 1) {
                result.innerText = `Лис(а) ${this.name} получил(а) передозировку лекарств.`;
                this.satiety = this.context.changeProperty(this.satiety, false);
                this._reactAccident();
                return;
            };
        };
        this._increseHealthAndMood();
        result.innerText = `Лису(лисе) ${this.name} уже лучше.`;
    };

    public play(): void {
        if (this.satiety < 0) {
            result.innerText = `Лис(а) ${this.name} не хочет играть, а хочет есть.`;
            return;
        };
        let randomNumber = this._random.generateNumber(12, 1);

        if (randomNumber === 1) {
            result.innerText = `В процессе игры Ваш питомец ${this.name} получил травму...`;
            this._reactAccident();
        } else {
            this._increseHealthAndMood();
            this.satiety = this.context.changeProperty(this.satiety, false);
            result.innerText = `Лис(а) ${this.name} хорошо поиграл(а).`;
        };
    };

    public setPropertiesToZero(): void {
        this.satiety = 0;
        this.mood = 0;
        this.health = 0;
    };
};

class CatCreator extends AnimalCreator {
    public factoryMethod(name: string, age: number): IAnimal {
        return new Cat(name, age);
    };
};

class DogCreator extends AnimalCreator {
    public factoryMethod(name: string, age: number): IAnimal {
        return new Dog(name, age);
    };
};

class FoxCreator extends AnimalCreator {
    public factoryMethod(name: string, age: number): IAnimal {
        return new Fox(name, age);
    };
};

const createNewAnimal: (creator: AnimalCreator, name: string, age: number) => IAnimal = (creator: AnimalCreator, name: string, age: number): IAnimal => {
    return creator.factoryMethod(name, age);
};

let AnimalOne: Dog = new Dog('Альма', 4);
let AnimalTwo: Cat = new Cat("Кузя", 9);
let AnimalThree: Fox = new Fox('Рыжик', 18);

let list: IAnimal[] = [
    AnimalOne,
    AnimalTwo,
    AnimalThree
];

const addAnimal: (animal: IAnimal) => void = (animal: IAnimal): void => {
    list.push(animal);
};

const deleteDeadAnimal: () => void = (): void => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].health < 0) {
            result!.innerText = `Печальная весть: ` +
                `${list[i].name} умер(ла) в возрасте ${list[i].age} ${list[i].age >= 5 ? 'лет' : 'г.'}`;
            list.splice(i, 1);
        } else if (list[i].satiety < -20) {
            result!.innerText = `Печальная весть: ` +
                `${list[i].name} умер(ла) в возрасте ${list[i].age} ${list[i].age >= 5 ? 'лет' : 'г.'} от голода.`;
            list.splice(i, 1);
        } else if (list[i].age > 19) {
            result!.innerText = `Печальная весть: ` +
                `${list[i].name} умер(ла) в возрасте ${list[i].age} ${list[i].age >= 5 ? 'лет' : 'г.'} от старости.`;
            list.splice(i, 1);
        };
    };
    showList();
};

const checkAndRiseAge: (animal: IAnimal) => void = (animal: IAnimal): void => {
    if (animal.mood > 110 && animal.satiety > 80) {
        animal.age += 1;
        animal.context = new Context(animal.age);
        animal.setPropertiesToZero();
        result!.innerText = `У ${animal.name} день рождения! ${animal.age} ${animal.age >= 5 ? 'лет' : 'г.'}`;
    };
};

const showList: () => void = (): void => {
    content.innerHTML = '';
    for (let i = 0; i < list.length; i++) {
        const row: HTMLElement = document.createElement('tr');
        row.innerHTML = `<td>${list[i].name}, ${list[i].age} ${list[i].age >= 5 ? 'лет' : 'г.'}</td>` +
            `<td>${list[i].satiety}</td><td>${list[i].mood}</td>` +
            `<td>${list[i].health}</td>` +
            `<td><button id="f-${i}" class="btn-small btn-red-brown">Накормить</button>` +
            `<button id="t-${i}" class="btn-small btn-brown">Лечить</button>` +
            `<button id="p-${i}" class="btn-small btn-red-brown">Играть</button></td>`;
        content.append(row);

        const feedBtn = document.querySelector(`#f-${i}`) as HTMLButtonElement;
        feedBtn.addEventListener('click', (ev: MouseEvent) => {
            ev.preventDefault();
            list[i].feed();
            checkAndRiseAge(list[i]);
            deleteDeadAnimal();
        });

        const treatBtn = document.querySelector(`#t-${i}`) as HTMLButtonElement;
        treatBtn.addEventListener('click', (ev: MouseEvent) => {
            ev.preventDefault();
            list[i].treat();
            checkAndRiseAge(list[i]);
            deleteDeadAnimal();
        });

        const playBtn = document.querySelector(`#p-${i}`) as HTMLButtonElement;
        playBtn.addEventListener('click', (ev: MouseEvent) => {
            ev.preventDefault();
            list[i].play();
            checkAndRiseAge(list[i]);
            deleteDeadAnimal();
        });
    };
};

const validateAge: (input: string) => number = (input: string): number => {
    if (!isNaN(parseInt(input)) && parseInt(input) >= 0 && parseInt(input) < 20) {
        return parseInt(input);
    } else {
        throw new Error('Некорректный возраст');
    };
};

window.addEventListener('load', () => {
    popUpAdd.style.display = 'none';
    showList();
});

showAddFormBtn.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault();
    popUpAdd.style.display = 'flex';
});

cancelBtn.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault();
    popUpAdd.style.display = 'none';
});

saveBtn.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault();

    let kind: string = kindOfAnimal.value;
    let nameValue: string | null = animalName.value.trim();
    let ageValue: string | null = animalAge.value.trim();

    try {

        if (nameValue && ageValue) {

            if (nameValue.length > 18) {
                nameValue = nameValue.substring(0, 18);
            };

            let age: number = validateAge(ageValue);
            if (kind === 'dog') {
                addAnimal(createNewAnimal(new DogCreator(), nameValue, age));
            } else if (kind === 'fox') {
                addAnimal(createNewAnimal(new FoxCreator(), nameValue, age));
            } else {
                addAnimal(createNewAnimal(new CatCreator(), nameValue, age));
            };

            popUpAdd.style.display = 'none';
            result.innerText = `Вы добавили ${nameValue} в список.`;
            showList();
        } else {
            throw new Error('Поля обязательны для заполнения');
        };

    } catch (error) {
        errorMessage.innerText = `${(error as Error).message}`;
    };
});