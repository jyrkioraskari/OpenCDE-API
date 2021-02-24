import * as express from "express";
import * as common_types from "./common.types";
import {Documentbase} from "./documentbase"



export class OpenCDEAPIDownloadRoutes{
    public app: express.Application;
    private readonly documents:Documentbase;

    constructor() {
        this.app = express.default();
        this.configure_routes();
        this.documents=Documentbase.getInstance();
    }

    configure_routes() {

		this.app.route(`/select-documents`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                next();
            })
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`User interface`);
        });


        this.app.get("/document_reference/:documentversion_id", (req, res) => {
            let file_version_uuidHash:string;
            file_version_uuidHash=req.params.documentversion_id;
            console.log("Download: Document version  was:"+ file_version_uuidHash);


            this.documents.db.get("document_reference:"+file_version_uuidHash).then(function (db_document_reference:any) {
                let document_reference:common_types.DocumentReference=db_document_reference.document_reference;
                console.log("Download: DB Document reference  was:"+ db_document_reference);
                console.log("Download: Document reference  was:"+ document_reference);
                res.json(document_reference);
            }).catch(function () {
                // handle any errors
            });
            console.log("Download: Document reference done.");

        });


        this.app.get("/document-version-metadata/:documentversion_id", (req, res) => {
            let file_version_uuidHash:string;
            file_version_uuidHash=req.params.documentversion_id;

            let document_metadata:common_types.DocumentMetadata;
            document_metadata={
                "_links": {
                    "self": {
                        href: "http://"+req.headers.host+"/link/to/resource"
                    },
                    "documentReference": {
                        href: "http://"+req.headers.host+"/link/to/resource"
                    }
                },
                "_metaData": [
                    {
                        "name": "string",
                        "value": "string",
                        "type": {
                            "type": "string",
                            "required": true,
                            "enumValues": [
                                "string"
                            ]
                        }
                    }
                ]
            };
            res.json(document_metadata);
        });

        this.app.get("/document-versions/:document_id", (req, res) => {

            let document_reference_list:common_types.DocumentReferenceList;
            document_reference_list={
                "_links": {
                    "self": {
                        href: "http://"+req.headers.host+":3000/link/to/resource"
                    }
                },
                "_embedded": {
                    "documentReferenceList": [
                        {
                            "_links": {
                                "self": {
                                    href: "http://"+req.headers.host+"/link/to/resource"
                                },
                                "metadata": {
                                    href: "http://"+req.headers.host+"/link/to/resource"
                                },
                                "versions": {
                                    href: "http://"+req.headers.host+"/link/to/resource"
                                },
                                "content": {
                                    href: "http://"+req.headers.host+"/link/to/resource"
                                }
                            },
                            "version": "string",
                            "version_date": "string",
                            "title": "string",
                            "file_description": {
                                "size_in_bytes": 0,
                                "name": "string"
                            }
                        }
                    ]
                }
            };
            res.json(document_reference_list);
        });


        return this.app;
    }
}

export default new OpenCDEAPIDownloadRoutes().app;