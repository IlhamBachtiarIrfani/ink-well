import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
    // ! ===== CHECK IF DATA IS VALID JSON =====
    isJSON(value) {
        if (typeof value !== 'object' || value === null) {
            return false;
        }

        try {
            JSON.stringify(value);
            return true;
        } catch (ex) {
            return false;
        }
    }
}
