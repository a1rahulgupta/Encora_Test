const i18n = require("i18n");
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const Controller = require('../Base/Controller');
const Model = require("../Base/Model");
const Notes = require('./Schema').Notes;
const RequestBody = require("../../services/RequestBody");
const CommonService = require("../../services/Common");
const { StatusCodes }  = require('http-status-codes');

class NotesController extends Controller {
    constructor() {
        super();
    }

    /********************************************************
     Purpose: Note insert and update
     Parameter:
     {
        "title":"",
        "description":""
     }
     Return: JSON String
     ********************************************************/
    async addUpdateNotes() {
        try {
            let fieldsArray = ['title', 'description'];
            this.req.body['userId'] = this.req.currentUser._id;
            console.log(this.req.body)
            let data = await (new RequestBody()).processRequestBody(this.req.body, fieldsArray);

            if (this.req.body.id) {
                const noteData = await Notes.findByIdAndUpdate(this.req.body.id, data, { new: true });
                if (_.isEmpty(noteData)) {
                    return this.res.status(StatusCodes.NOT_MODIFIED).send({ status: 0, message: i18n.__('NOTES__NOT_UPDATED') })
                }
                return this.res.status(StatusCodes.OK).send({ status: 1, message: i18n.__('NOTES_UPDATED'), noteData })

            } else {
                const noteData = await (new Model(Notes)).store(data);
                if (_.isEmpty(noteData)) {
                    return this.res.status(StatusCodes.BAD_REQUEST).send({ status: 0, message:i18n.__('NOTES_NOT_SAVED.') })
                }
                return this.res.status(StatusCodes.OK).send({ status: 1, message: i18n.__('NOTES_SAVED'), noteData });
            }

        } catch (error) {
            console.log("error- ", error);
            return this.res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ status: 0, message: error });
        }
    }

     /********************************************************
     Purpose:notes list
     Parameter:
     {
            "page":1,
            "pagesize":10
     }
     Return: JSON String
     ********************************************************/

    async notesList() {
        try {
            this.req.body['model'] = Notes;
            this.req.body['userId'] = this.req.currentUser._id;
            let data = { bodyData: this.req.body }
            if (this.req.body.searchText) {
                data.fieldsArray = ['title']
                data.searchText = this.req.body.searchText;
            }
            let result = await new CommonService().listing(data);
            return this.res.send(result);
        } catch (error) {
            console.log("error- ", error);
            this.res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ status: 0, message: error });
        }
    }


    /********************************************************
     Purpose:Note description
     Parameter:
     {
           "noteId":"1"
     }
     Return: JSON String
     ********************************************************/
    async notesDetail() {
        try {
            const noteData = await Notes.findOne({ _id: ObjectId(this.req.params.noteId), isDeleted: false }, { __v: 0 });
            return this.res.send(_.isEmpty(noteData) ? { status: 0, message: i18n.__('NOTE_NOT_FOUND') } : { status: 1, data: noteData });
        } catch (error) {
            console.log("error- ", error);
            this.res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ status: 0, message: error });
        }
    }

    /********************************************************
     Purpose:Notes delete
     Parameter:
     {
          "ids": ["5ffeb773ca25600c8b50e03c"]

     }
     Return: JSON String
     ********************************************************/
    async deleteNotes() {
        try {
            let msg = i18n.__("NOTES_NOT_DELETED");
            const updatedNotes = await Notes.updateMany({ _id: { $in: this.req.body.ids }, isDeleted: false }, { $set: { isDeleted: true } });
            if (updatedNotes) {
                msg = updatedNotes.nModified ? updatedNotes.nModified +  i18n.__("NOTES_DELETED") : updatedNotes.n == 0 ? i18n.__("NOTES_NOT_FOUND") : msg;
            }
            return this.res.status(StatusCodes.OK).send({ status: 1, message: msg });
        } catch (error) {
            console.log("error- ", error);
            this.res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ status: 0, message: error });
        }
    }

   
  

}
module.exports = NotesController;