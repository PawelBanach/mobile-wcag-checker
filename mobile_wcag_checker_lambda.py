from __future__ import annotations

import json
import os
import tarfile
import xml.etree.ElementTree as ET
from botocore.vendored import requests
from functools import reduce
from io import BytesIO
from typing import Tuple, Optional, Dict


import boto3 as boto3


class Score(object):
    def __init__(self, points: float, entries: int, cons: dict, pros: dict):
        self.score = points / entries if entries > 0 else None
        self.points = points
        self.entries = entries
        self.cons = cons
        self.pros = pros

    def mappend(self, s: Score) -> Score:
        return Score(
            self.points + s.points,
            self.entries + s.entries,
            {**self.cons, **s.cons},
            {**self.pros, **s.pros},
        )

    def __str__(self):
        return f"score: {self.score}, points: {self.points}, entries: {self.entries}, cons: {self.cons}, pros: {self.pros}"

    def to_json(self):
        return json.dumps({
            'score': self.score,
            'points': self.points,
            'entries': self.entries,
            'cons': self.cons,
            'pros': self.pros,
        })


def maybe_find_attribute(attrs: dict, attr_name: str) -> Optional[str]:
    for key, val in attrs.items():
        if attr_name in key:
            return val
    return None


def find_all_attributes(attrs: Dict[str, str], attr_name: str) -> Tuple[str]:
    return tuple(val for key, val in attrs.items() if attr_name in key)


def is_element_large_enough(attrs: dict) -> bool:
    width_enough = False
    height_enough = False

    maybe_min_width = maybe_find_attribute(attrs, "minWidth")
    maybe_min_height = maybe_find_attribute(attrs, "minHeight")

    if maybe_min_width is not None:
        try:
            width = int(maybe_min_width.split("dp")[0])
            if width >= 48:
                width_enough = True
        except:
            pass
    if maybe_min_height is not None:
        try:
            height = int(maybe_min_height.split("dp")[0])
            if height >= 48:
                height_enough = True
        except:
            pass

    return width_enough and height_enough


def score(el_tag: str, attrib: dict) -> Score:
    score = 0.0
    cons = []
    pros = []

    maybe_important_for_accessibility = maybe_find_attribute(attrib, "importantForAccessibility")
    if maybe_important_for_accessibility is None:
        cons.append("Lacks \'importantForAccessibility\' attribute")
    elif maybe_important_for_accessibility == "no":
        pros.append("\'importantForAccessibility\' attribute")
        return Score(1, 1, {el_tag: cons}, {el_tag: pros})
    else:
        pros.append("\'importantForAccessibility\' attribute")
        score += 0.5

    maybe_content_description = maybe_find_attribute(attrib, "contentDescription")
    if maybe_content_description is None:
        cons.append("Lacks \'contentDescription\' attribute")
    elif "button" in maybe_content_description.lower():  # TODO: add more https://developer.android.com/reference/android/view/View.html
        cons.append(f"Repeated view type in \'contentDescription\': {maybe_content_description}")
        pros.append("\'contentDescription\' attribute")
        score += 0.5
    else:
        pros.append("\'contentDescription\' attribute")
        score += 1.0

    if "Edit" in el_tag:
        maybe_hint = maybe_find_attribute(attrib, "hint")
        if maybe_hint is None:
            cons.append("Lacks \'hint\' attribute in editable field")
        else:
            pros.append("\'hint\' attribute in editable field")
            score += 1.0

    accessibility_attributes = find_all_attributes(attrib, "accessibility")
    for attr in accessibility_attributes:
        pros.append(f"\'{attr}\' attribute")
        score += 2.0

    if "View" in el_tag or "Layout" in el_tag:
        maybe_focusable = maybe_find_attribute(attrib, "focusable")
        if maybe_focusable is not None:
            pros.append("\'focusable\' attribute")
            score += 2.0
        maybe_screen_reader_focusable = maybe_find_attribute(attrib, "screenReaderFocusable")
        if maybe_screen_reader_focusable is not None:
            pros.append("\'screenReaderFocusable\' attribute")
            score += 2.0

    if is_element_large_enough(attrib):
        pros.append("Size larger than 48dpx48dp")
        score += 1.0
    else:
        cons.append("Element size smaller than 48dp x 48dp")

    return Score(score, 1, {el_tag: cons}, {el_tag: pros})


def doStuff(parent_path: str, el: ET.Element) -> Score:
    full_path = f'{parent_path}/{el.tag}'
    my_score: Score = score(el.tag, el.attrib)
    for key in my_score.cons.keys():
        my_score.cons[full_path] = my_score.cons.pop(key)
    for key in my_score.pros.keys():
        my_score.pros[full_path] = my_score.pros.pop(key)
    child_score: Tuple[Score] = tuple(doStuff(full_path, child) for child in el)
    scores: Tuple[Score] = (*child_score, my_score)
    return reduce(lambda x, y: x.mappend(y), scores)


def score_file(filename: str):
    try:
        root: ET.Element = ET.parse(filename).getroot()
        result = doStuff("", root)
        result.cons = {filename: result.cons}
        result.pros = {filename: result.pros}
        return result
    except:
        return None


def traverse_dir(dir: str):
    result = Score(0, 0, {}, {})
    for root, dirs, files in os.walk(dir):
        for f in files:
            full_path = os.path.join(root, f)
            if "layout" in full_path and os.path.splitext(full_path)[1] == '.xml':
                score = score_file(full_path)
                if score is not None:
                    result = result.mappend(score)
    return result


def lambda_handler(event, context):
    s3 = boto3.client("s3")

    if event:
        print("Event: ", event)
        file_obj = event["Records"][0]
        filename = str(file_obj['s3']['object']['key'])
        print("Filename: ", filename)
        fileObj = s3.get_object(Bucket="mobile-wcag-checker", Key=filename)

        # Save it to local storage
        tmp_folder_path = f"/tmp/{filename}"

        bytes = BytesIO(fileObj.get("Body").read())
        tf = tarfile.open(fileobj=bytes)
        tf.extractall(tmp_folder_path)

        result = traverse_dir(tmp_folder_path)

        print("Result: ", result)
        HOST = "http://630aa7b0.ngrok.io"
        API_ENDPOINT = f"{HOST}/mobile_apps/{filename}"
        requests.put(url = API_ENDPOINT, data = { 'accessibility': result.to_json()  })

        return {
            'statusCode': 200,
            'body': result.to_json()
        }

    return {
        'statusCode': 204,
    }

