module.exports = (app, express) => {

    const router = express.Router();

    const Globals = require("../../../configs/Globals");
    const NotesController = require('./Controller');
    const config = require('../../../configs/configs');
    const Validators = require("./Validator");

    router.post('/addUpdateNotes', Globals.isUserAuthorised(), Validators.notesValidator(), Validators.validate, (req, res, next) => {
        const noteObj = (new NotesController()).boot(req, res, next);
        return noteObj.addUpdateNotes();
    });

    router.get('/getNotesDetails/:noteId', Globals.isUserAuthorised(), Validators.detailValidator(), Validators.validate, (req, res, next) => {
        const noteObj = (new NotesController()).boot(req, res, next);
        return noteObj.notesDetail();
    });

    router.post('/deleteNotes', Globals.isUserAuthorised(), Validators.deleteValidator(), Validators.validate, (req, res, next) => {
        const noteObj = (new NotesController()).boot(req, res, next);
        return noteObj.deleteNotes();
    });

    router.post('/notesList', Globals.isUserAuthorised(), Validators.listingValidator(), Validators.validate, (req, res, next) => {
        const noteObj = (new NotesController()).boot(req, res, next);
        return noteObj.notesList();
    });

    app.use(config.baseApiUrl, router);
}