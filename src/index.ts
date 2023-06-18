import {AptosAccount, AptosAccountObject, HexString} from 'aptos'
import * as fs from 'fs';
import * as path from 'path';
import * as createCsvWriter from 'csv-writer';
interface AptosExportObject extends AptosAccountObject{
    mnemonics:string,
}
const readFileToArray = (filename: string): string[] =>{
    const filePath = path.join(__dirname, filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');
    return lines;
}
const exportToCSV =async (data:AptosExportObject[])=>{
    const csvWriter = createCsvWriter.createObjectCsvWriter({
        path: Date.now()+'_output.csv',
        header: [
            { id: 'address', title: 'Address' },
            { id: 'publicKeyHex', title: 'Public Key' },
            { id: 'privateKeyHex', title: 'Private Key' },
            { id: 'mnemonics', title: 'Mnemonics' }
        ]
    });
    return csvWriter.writeRecords(data)

}
const main= async()=>{
    console.log("Hello World");
    const mnemonic = readFileToArray('example_mnemonics.txt');
    console.log(mnemonic);
    const derivationPath = `m/44'/637'/0'/0'/0'`;
    // const data = AptosAccount.fromDerivePath(derivationPath, 'oil saddle pig much engine blade expose bachelor impulse palace inject time');
    // console.log(data);
    // console.log(data.toPrivateKeyObject())
    const data:AptosExportObject[] = mnemonic.map((mnemonic)=> {
        const aptosAccount = AptosAccount.fromDerivePath(derivationPath, mnemonic);
        const account:AptosExportObject ={...aptosAccount.toPrivateKeyObject(), mnemonics:mnemonic}
        console.log(account);
        return account;
    })
    await exportToCSV(data)


}
main();