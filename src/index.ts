import * as CryptoJS from 'crypto-js'; 

class Block {

    static calculateBlockHash = (
        index: number, 
        previousHash: string, 
        data: string, 
        timestamp: number
    ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

    static validateStructure = (aBlock: Block): boolean => 
        typeof aBlock.index === "number" && 
        typeof aBlock.hash === "string" && 
        typeof aBlock.previousHash === "string" && 
        typeof aBlock.data ==="string" &&
        typeof aBlock.timestamp === "number";
    

    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(index: number, hash: string, previousHash: string, data: string, timestamp: number) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, "123123123", "", "hello", 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = () : Block[] => blockchain;

const getLatestBlock = () : Block => blockchain[blockchain.length - 1];

const getNewTimesStamp = () : number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string) : Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getNewTimesStamp();
    const nextHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, data, nextTimestamp);
    const newBlock: Block = new Block(newIndex, nextHash, previousBlock.hash, data, nextTimestamp);
    addBlock(newBlock); //새로 생성한 블록을 addBlock 함수를 사용하여 블록체인에 추가
    return newBlock;
}

const getHashforBlock = (aBlock: Block) : string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.data, aBlock.timestamp);

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) { //candidateBlock 이 유효하지 않으면 False
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) { //previousBlock의 인덱스+1랑 candidateBlock블록의 인덱스가 다르면 False
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) { //previousBlock의 해쉬와 candidateBlock블록의 previousHash가 다르면 False
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) { //따로 해쉬를 계산해서 블록의 해쉬가 유효한지 체크
        return false;
    } else {
        return true;
    }
}

const addBlock = (candidateBlock: Block) : void => {
    if(isBlockValid(candidateBlock, getLatestBlock())) { 
        blockchain.push(candidateBlock);
    }
}

createNewBlock("second block");
createNewBlock("thrid block");
createNewBlock("fourth block");

console.log(blockchain);

export {};