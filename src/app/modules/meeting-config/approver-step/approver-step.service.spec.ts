import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApproverStepService } from './approver-step.service';
import { QueryListModel } from 'app/models/query-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { DataListModel } from 'app/models/data-list.model';
import { ApproverStepModel } from 'app/models/standard.model';

describe('ApproverStepService', () => {
    let service: ApproverStepService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApproverStepService],
        });
        service = TestBed.inject(ApproverStepService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get data list', () => {
        // create mock QueryListModel
        const query = new QueryListModel({});
        query.page = 1;
        query.pageSize = 10;

        // create mock response
        const mockResponse = new DataListModel<ApproverStepModel>({},ApproverStepModel);

        // call the method and subscribe to the returned observable
        service.getDatas(query).subscribe((response) => {
            // assert that the response is as expected
            expect(response).toEqual(mockResponse);
        });

        // expect a post request to the specified endpoint
        const req = httpMock.expectOne(`${ENDPOINT.approverStep.search}`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });
});
