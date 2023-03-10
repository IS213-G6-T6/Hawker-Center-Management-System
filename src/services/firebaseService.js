var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { useToast } from 'vue-toastification';
const toast = useToast();
export class FirebaseService {
    constructor() {
        this.baseUrl =
            'https://is216-bigreddot-default-rtdb.asia-southeast1.firebasedatabase.app';
        this.businessUrl = this.baseUrl + '/businesses';
        this.ratingUrl = this.baseUrl + '/ratings.json';
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield axios.get(this.businessUrl + '.json');
                let data = res.data;
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getDataByCategory(categories) {
        return __awaiter(this, void 0, void 0, function* () {
            var matchCategories = Object.values(categories);
            try {
                let res = yield axios.get(this.businessUrl + '.json');
                let data = res.data;
                let retData = data.filter((business) => {
                    return matchCategories.includes(business.category);
                });
                return retData;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getDataByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var getIdUrl = this.businessUrl + '/' + (id - 1) + '.json';
            try {
                let res = yield axios.get(getIdUrl);
                let data = res.data;
                return data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateRating(bid, uid, name, rating, review, datetime, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRatingUrl = this.businessUrl + '/' + bid + '/ratings/' + uid + '.json';
            const tempRatingEntity = {
                name: name,
                ratingscore: rating,
                reviewtext: review,
                datetime: datetime,
            };
            try {
                let res = yield axios.put(updateRatingUrl, tempRatingEntity, {
                    params: { auth: token },
                });
                if (res.status === 200) {
                    toast.success('Review added successfully!', { timeout: 5000 });
                }
                window.location.href = window.location.pathname + '?updated=1';
            }
            catch (err) {
                toast.error('Unable to add review, try again later.', {
                    timeout: 5000,
                });
                throw err;
            }
        });
    }
}
